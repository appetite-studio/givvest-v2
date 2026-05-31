// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IYieldStrategy } from "./interfaces/IYieldStrategy.sol";

/// @notice Minimal Aave V3 Pool interface used by AaveV3Strategy.
interface IAavePool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
    function getReserveData(
        address asset
    )
        external
        view
        returns (
            uint256 configuration,
            uint128 liquidityIndex,
            uint128 currentLiquidityRate,
            uint128 variableBorrowIndex,
            uint128 currentVariableBorrowRate,
            uint128 currentStableBorrowRate,
            uint40 lastUpdateTimestamp,
            uint16 id,
            address aTokenAddress,
            address stableDebtTokenAddress,
            address variableDebtTokenAddress,
            address interestRateStrategyAddress,
            uint128 accruedToTreasury,
            uint128 unbacked,
            uint128 isolationModeTotalDebt
        );
}

/// @title AaveV3Strategy
/// @notice Wraps Aave V3 to provide yield on USDC deposits for GivvestVault.
/// @dev Only the vault may call deposit/withdraw. Deployed with immutable pool and USDC addresses
///      derived from the chain config; no addresses are hardcoded.
contract AaveV3Strategy is IYieldStrategy, Ownable {
    using SafeERC20 for IERC20;

    // Immutable addresses set at deploy time from the chain config.
    IAavePool public immutable pool;
    IERC20 public immutable usdc;
    IERC20 public immutable aUsdc; // Aave's interest-bearing USDC token

    /// @notice The vault address; only it may call deposit/withdraw.
    address public vault;

    event VaultSet(address indexed vault);

    error OnlyVault();
    error ZeroAddress();

    modifier onlyVault() {
        if (msg.sender != vault) revert OnlyVault();
        _;
    }

    /// @param _pool   Aave V3 Pool address for this chain.
    /// @param _usdc   USDC token address for this chain.
    /// @param _aUsdc  Aave aUSDC token address for this chain.
    /// @param _owner  Initial owner (deployer; transferred to admin wallet on live deploy).
    constructor(address _pool, address _usdc, address _aUsdc, address _owner) Ownable(_owner) {
        if (_pool == address(0) || _usdc == address(0) || _aUsdc == address(0)) revert ZeroAddress();
        pool = IAavePool(_pool);
        usdc = IERC20(_usdc);
        aUsdc = IERC20(_aUsdc);
    }

    /// @notice Sets the vault address. Called once after vault is deployed.
    function setVault(address _vault) external onlyOwner {
        if (_vault == address(0)) revert ZeroAddress();
        vault = _vault;
        emit VaultSet(_vault);
    }

    // --- IYieldStrategy ---

    /// @inheritdoc IYieldStrategy
    function asset() external view override returns (address) {
        return address(usdc);
    }

    /// @inheritdoc IYieldStrategy
    /// @dev Pulls USDC from the vault (vault must have approved this contract) and supplies to Aave.
    function deposit(uint256 amount) external override onlyVault {
        usdc.safeTransferFrom(vault, address(this), amount);
        usdc.forceApprove(address(pool), amount);
        pool.supply(address(usdc), amount, address(this), 0);
    }

    /// @inheritdoc IYieldStrategy
    /// @dev Withdraws USDC from Aave and sends it directly to `to`.
    function withdraw(uint256 amount, address to) external override onlyVault {
        pool.withdraw(address(usdc), amount, to);
    }

    /// @inheritdoc IYieldStrategy
    /// @dev Returns this contract's aUSDC balance, which rebases upward as interest accrues.
    function totalAssets() external view override returns (uint256) {
        return aUsdc.balanceOf(address(this));
    }

    /// @inheritdoc IYieldStrategy
    /// @dev Returns Aave's annualized current liquidity rate in ray (1e27).
    ///      Used only for APY projections in the UI; never used for fund movement.
    function currentRateRay() external view override returns (uint256) {
        (, , uint128 currentLiquidityRate, , , , , , , , , , , , ) = pool.getReserveData(address(usdc));
        return uint256(currentLiquidityRate);
    }
}
