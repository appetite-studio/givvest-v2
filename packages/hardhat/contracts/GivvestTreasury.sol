// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/// @title GivvestTreasury
/// @notice Holds harvested yield and distributes it to charity wallets.
/// @dev    Owner is an admin wallet that calls distribute to send USDC to charity addresses.
contract GivvestTreasury is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;

    /// @notice Total USDC distributed to all charity wallets.
    uint256 public totalDonated;

    /// @notice USDC distributed per charity wallet address.
    mapping(address => uint256) private _donatedTo;

    event Donated(address indexed charity, uint256 amount, uint256 timestamp);

    error ZeroAddress();
    error ZeroAmount();
    error InsufficientBalance();

    /// @param _usdc  USDC token address on this chain.
    /// @param _owner Initial owner (admin wallet; transferred on live deploy).
    constructor(address _usdc, address _owner) Ownable(_owner) {
        if (_usdc == address(0)) revert ZeroAddress();
        usdc = IERC20(_usdc);
    }

    /// @notice Send `amount` USDC to `charity`. Only callable by the owner.
    /// @dev    No on-chain allowlist. The owner (admin wallet) is the only gate.
    /// @param charity Recipient charity wallet. Must not be the zero address.
    /// @param amount  Amount of USDC to send (6 decimals). Must be > 0.
    function distribute(address charity, uint256 amount) external onlyOwner {
        if (charity == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (usdc.balanceOf(address(this)) < amount) revert InsufficientBalance();

        totalDonated += amount;
        _donatedTo[charity] += amount;

        usdc.safeTransfer(charity, amount);
        emit Donated(charity, amount, block.timestamp);
    }

    /// @notice Returns total USDC donated to a specific charity wallet.
    function donatedTo(address charity) external view returns (uint256) {
        return _donatedTo[charity];
    }

    /// @notice Returns USDC balance currently held in the treasury (ready to distribute).
    function balance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}
