Custom PoolState Multicall
===============

**Note:** Experimental work-in-progress

Based off of ricmoos Account Scanner: https://github.com/ricmoo/account-scanner

A custom multicall contract to retrieve pool information for Balancer SOR. Aiming to improve execution speed for large amounts of calls.

## Results

For 1000 test pools comparing [Multicall contract](https://github.com/makerdao/multicall) vs custom mulitcall (See compare.ts):

| Method | Time | Time | Time | Time |
| ----------- | ----------- | ----------- |  ----------- | ----------- |
| Multicall | 12338.828ms | 9077.579ms | 10057.046ms | 13939.428ms |
| Custom | 3319.800ms | 3025.077ms | 3186.130ms | 3336.242ms |
