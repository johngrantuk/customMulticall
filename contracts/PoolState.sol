pragma solidity 0.5.12;

pragma experimental ABIEncoderV2;

// import "@nomiclabs/buidler/console.sol";

contract PoolState {

    // Calls addr with data which returns (uint256)
    function getUint(address addr, bytes memory data) internal view returns (uint result) {
        result = 0;

        assembly {
            let status := staticcall(16000, addr, add(data, 32), mload(data), 0, 0)

            // Success!
            if eq(status, 1) {
                if eq(returndatasize(), 32) {
                    returndatacopy(0, 0, 32)
                    result := mload(0)
                }
            }
        }
    }

    struct PoolInfo {
        uint balance;
        uint normalizedWeight;
        uint fee;
    }

    function getPoolInfo(address[][] calldata pools, uint length) external view returns (uint[] memory) {
        uint[] memory results = new uint[](length);
        uint count = 0;
        // console.log("Length %s", length);

        for (uint i = 0; i < pools.length; i++) {
            address poolAddr = pools[i][0];

            // console.log("Pool: %s", poolAddr);
            results[count] = getUint(poolAddr, abi.encodeWithSignature("getSwapFee()"));
            count++;

            for (uint j = 1; j < pools[i].length; j++) {
              address tokenAddr = pools[i][j];
              // console.log("Token: %s", tokenAddr);
              results[count] = getUint(poolAddr, abi.encodeWithSignature("getBalance(address)", tokenAddr));
              count++;
              results[count] = getUint(poolAddr, abi.encodeWithSignature("getDenormalizedWeight(address)", tokenAddr));
              count++;
              // console.log("Token Done");
            }
        }

        return results;
    }
}
