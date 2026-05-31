// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IYieldStrategy
/// @notice Interface for yield-generating strategies used by GivvestVault.
/// @dev The vault owns a single strategy at a time. Governance can swap it via setStrategy.
interface IYieldStrategy {
    /// @notice Returns the underlying asset token address (USDC).
    function asset() external view returns (address);

    /// @notice Deposits `amount` of USDC from the caller (vault) into the strategy.
    /// @dev Caller must have approved this contract to spend `amount` USDC first.
    /// @param amount Amount of USDC to deposit (6 decimals).
    function deposit(uint256 amount) external;

    /// @notice Withdraws `amount` of USDC from the strategy and sends it to `to`.
    /// @param amount Amount of USDC to withdraw (6 decimals).
    /// @param to Recipient of the withdrawn USDC.
    function withdraw(uint256 amount, address to) external;

    /// @notice Returns the current total USDC value redeemable from this strategy.
    /// @dev For Aave, this is the aToken balance which grows as interest accrues.
    function totalAssets() external view returns (uint256);

    /// @notice Returns the current annualized supply rate in ray units (1e27).
    /// @dev Used only for display projections, never for fund movement decisions.
    function currentRateRay() external view returns (uint256);
}
