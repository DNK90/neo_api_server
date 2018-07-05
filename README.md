# NEO API Server that listens to contract activities defined in `contract` folder

NEO API Server is used for listen all contracts events executed in neo private network then handle them

Currently, this project is used to listen to deposit/release/voting activities from ETH and NEO private network.

## 1. Requirements:

- docker

- docker-compose

## 2 Install
### 2.1 Install using docker

```bash
docker pull kardiachain/neo_api_server
```

### 2.2 Install manually

- Run server from api.py

```bash
PYTHONPATH='.' python3 src/api.py --privnet --port-rpc=5000 --port-rest=8080 --logfile="log.txt"
```

- Setup neo private network. Read here https://github.com/CityOfZion/neo-python

### 2.3 Update neo-python and deploy contract to private network


```bash
# connect to neo-privnet container
docker exec -it neo-privnet bash

# update latest neo-python
git pull

# clone neo_api_server
git clone https://github.com/kardiachain/neo_api_server.git

# claim gas
python3 claim_gas_fixedwallet.py

# access to prompt
python3 neo/bin/prompt.py -p

# open wallet - enter password 'coz'
open wallet neo-privnet.wallet

# build and import deposit/release contract
build /neo-python/api-server/contract/neo_deposit_release.py test 0705 01 True False updateRate [1, 10000000]
import contract /neo-python/api-server/contract/neo_deposit_release.avm 0705 01 True False

# enter password 'coz', copy transaction hash has been generated, and check whether transaction is executed or not
tx <transaction_hash>

# build and import voting contract

build /neo-python/api-server/contract/neo_voting.py test 0705 01 True False vote ['smartcontractaddress', 'Kien']
import contract /neo-python/api-server/contract/neo_voting.avm 0705 01 True False

# enter password 'coz', copy transaction hash has been generated, and check whether transaction is executed or not
tx <transaction_hash>

```
