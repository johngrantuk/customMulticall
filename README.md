Custom PoolState Multicall
===============

**Note:** Experimental work-in-progress

Based off of ricmoos Account Scanner: https://github.com/ricmoo/account-scanner

A custom multicall contract to retrieve pool information for Balancer SOR. Aiming to improve execution speed for large amounts of calls.

## Results

For 1000 test pools comparing [Multicall contract](https://github.com/makerdao/multicall) vs custom mulitcall (See compare.ts):

| Method | Time | Time | Time | Time |
| ----------- | ----------- | ----------- |  ----------- | ----------- |
| Multicall | 11707.322ms | 8494.433ms | 12765.703ms | 8985.448ms |
| Custom | 4056.966ms | 4210.295ms | 4049.101ms | 4078.856ms |
