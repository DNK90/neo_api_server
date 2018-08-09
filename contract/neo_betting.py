from boa.interop.Neo.Runtime import Notify, GetTrigger, Log, CheckWitness, Deserialize, Serialize
from boa.interop.Neo.Storage import Get, Put, Delete, GetContext
from boa.interop.Neo.TriggerType import Verification, Application
from boa.interop.System.ExecutionEngine import GetScriptContainer, GetExecutingScriptHash
from boa.interop.Neo.Transaction import Transaction, GetReferences
from boa.interop.Neo.Output import GetValue, GetAssetId, GetScriptHash
from boa.interop.BigInteger import BigInteger, ONE
from boa.interop.Neo.Action import RegisterAction


gas_asset_id = b'\xe7-(iy\xeel\xb1\xb7\xe6]\xfd\xdf\xb2\xe3\x84\x10\x0b\x8d\x14\x8ewX\xdeB\xe4\x16\x8bqy,`'
neo_asset_id = b'\x9b|\xff\xda\xa6t\xbe\xae\x0f\x93\x0e\xbe`\x85\xaf\x90\x93\xe5\xfeV\xb3J\\"\x0c\xcd\xcfn\xfc3o\xc5'
token_owner = b'#\xba\'\x03\xc52c\xe8\xd6\xe5"\xdc2 39\xdc\xd8\xee\xe9'

OnBet = RegisterAction('OnBet', "from_address", "bet_id", "option", "amount")
context = GetContext()


# NEO betting is used for demonstration purpose.
# Case:
#   1/ User bet by sending same amount of NEO and content to smart contract,
#       smc then store user info (address, option) then broadcast event onBet
def get_asset_attachments():
    """
    Gets information about NEO and Gas attached to an invocation TX

    :return:
        list: A list with information about attached neo and gas
    """

    tx = GetScriptContainer()
    references = tx.References

    receiver = GetExecutingScriptHash()

    sender = None
    sent_amount_neo = 0
    sent_amount_gas = 0

    if len(references) > 0:

        reference = references[0]
        sender = reference.ScriptHash

        for output in tx.Outputs:
            if output.ScriptHash == receiver:
                if output.AssetId == neo_asset_id:
                    sent_amount_neo += output.Value
                if output.AssetId == gas_asset_id:
                    sent_amount_gas += output.Value

    return [receiver, sender, sent_amount_neo, sent_amount_gas]


def get_bet(from_address, bet_id, option):
    # bet_id and option will be concatenated. They must be string
    result = Get(context, from_address + bet_id + option)
    if result != bytearray(b''):
        result = Deserialize(result)
        if result > 0:
            return result

    return 0


def get_addresses(bet_id, option):
    addresses = Get(context, bet_id + option)
    if addresses != bytearray(b''):
        return Deserialize(addresses)
    return []


def get_total_bet(bet_id, option):
    amount = Get(context, bet_id + option + 'amount')
    if amount != bytearray(b''):
        return Deserialize(amount)
    return 0


def bet(from_address, bet_id, option, amount):
    # save address to context
    print(from_address)
    print(bet_id)
    print(option)
    print(amount)

    result = get_bet(from_address, bet_id, option)
    result += amount
    addresses = get_addresses(bet_id, option)

    # check exist address
    exist = False
    print("check address exists")
    if len(addresses) > 0:
        for address in addresses:
            if from_address == address:
                exist = True

    if not exist:
        addresses.append(from_address)

    print("get and update total bet")
    total = get_total_bet(bet_id, option)
    total += amount

    print("Put context 'bet_id + option' = addresses")
    Put(context, bet_id + option, Serialize(addresses))

    print("Put context 'from_address + bet_id + option' = result")
    Put(context, from_address + bet_id + option, Serialize(result))

    print("Put context 'bet_id + option + amount' = total")
    Put(context, bet_id + option + 'amount', Serialize(total))

    print("Fire OnBet event")
    OnBet(from_address, bet_id, option, result)

    return True


def Main(operation, args):

    trigger = GetTrigger()
    if trigger == Verification():
        print("Verification")
        return CheckWitness(token_owner)

    if trigger == Application():
        if operation == "bet":
            if len(args) != 2 or args[1] == '':
                return False

            attachments = get_asset_attachments()
            sent_neo = attachments[2]
            sender = attachments[1]

            bet_id = args[0]
            option = args[1]

            print("sent_neo")
            print(sent_neo)

            if sent_neo > 0:
                bet(sender, bet_id, option, sent_neo)

            return True

    print("nothing matches")
    return False


