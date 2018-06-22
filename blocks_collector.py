import grequests
from grequests import request
import binascii
import simplejson


NEO_SCAN = "https://neoscan.io/api/main_net/v1"
GET_HIGHEST = "{}/get_highest_block".format(NEO_SCAN)
GET_BLOCK = "{}/get_block".format(NEO_SCAN)
GET_TRANSACTION = "{}/get_transaction".format(NEO_SCAN)


def decode_script(script):
    shash = bytearray.fromhex(script)
    shash.reverse()

    if len(shash) >= 20:
        shash = shash[:20]
        return binascii.hexlify(shash)

    return None


def get_contract_hashes(urls):

    rq = (grequests.get(u) for u in urls)
    rq = grequests.map(rq)
    hashes = []
    if len(rq) > 0:
        for r in rq:
            if r.status_code == 200:
                transaction = simplejson.loads(r.text)
                if transaction["type"] == "InvocationTransaction":
                    hashes.append(decode_script(transaction["script"]))

    return hashes


def collect_data(block_id):
    rq = request('GET', "{}/{}".format(GET_BLOCK, block_id)).send()
    rq = rq.response
    if rq.status_code != 200:
        return None

    result = dict(
        blockId=block_id,
    )

    contract = {}

    block = simplejson.loads(rq.text)
    transactions = block["transactions"]
    if len(transactions) > 0:
        urls = ["{}/{}".format(GET_TRANSACTION, tx) for tx in transactions]
        contract_hashes = get_contract_hashes(urls)
        if len(contract_hashes) > 0:
            for contract_hash in contract_hashes:
                if contract_hash in contract:
                    contract[contract_hash] += 1
                else:
                    contract[contract_hash] = 1

    result["contract"] = contract
    return result


def get_1000_block():
    result = []
    rq = request('GET', GET_HIGHEST).send()
    rq = rq.response

    if rq.status_code == 200:
        highest_block = simplejson.loads(rq.text)["index"]
        from_block = highest_block - 1000

        while from_block <= highest_block:
            data = collect_data(from_block)
            print(data)
            result.append(data)
            from_block += 1

    return result


def write_file(inp):
    neo = open("neo_1000_block.json", "w")
    neo.write(simplejson.dumps(inp, indent=4, sort_keys=True))
    neo.close()


results = get_1000_block()
write_file(results)
