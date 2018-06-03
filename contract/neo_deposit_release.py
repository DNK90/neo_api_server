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

OnEvent = RegisterAction('OnEvent', 'receiver', 'sender', 'sent_neo', 'sent_gas')
OnDeposit = RegisterAction('OnDeposit', 'type', 'amount', 'receiver', 'rate')
OnRelease = RegisterAction('OnRelease', 'type', 'amount', 'receiver')

context = GetContext()


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

    OnEvent(receiver, sender, sent_amount_neo, sent_amount_gas)
    return [receiver, sender, sent_amount_neo, sent_amount_gas]


def get_latest_rate(_type):
    rates = get_rates(_type)

    if len(rates) > 0:
        return rates[len(rates) - 1]

    return -1


def get_rates(_type):
    result = Get(context, _type)
    if result != bytearray(b''):
        rates = Deserialize(result)
        if len(rates) > 0:
            return rates

    return []


def update_rate(_type, rate):

    if CheckWitness(token_owner):
        rates = get_rates(_type)
        rates.append(rate)
        Put(context, _type, Serialize(rates))
        return True

    return False


def deposit(_type, amount, receiver):

    rate = get_latest_rate(_type)
    if rate > -1:
        OnDeposit(_type, amount, receiver, rate)
    else:
        release(_type, amount, receiver)


def release(_type, amount, receiver):
    OnRelease(_type, amount, receiver)
    return True


def Main(operation, args):

    trigger = GetTrigger()

    if trigger == Verification():
        if CheckWitness(token_owner):
            attachments = get_asset_attachments()
            if attachments[2] > 0:
                _type = "neo"
                amount = attachments[2]
            elif attachments[3] > 0:
                _type = "gas"
                amount = attachments[3]
            else:
                return False

            receiver = attachments[0]
            return release(_type, amount, receiver)

        return False

    elif trigger == Application():
        if operation == "deposit":
            if len(args) != 2 or args[1] == '':
                return False

            attachments = get_asset_attachments()
            sent_neo = attachments[2]
            sent_gas = attachments[3]

            _type = args[0]
            receiver = args[1]

            if sent_neo > 0:
                deposit(_type, sent_neo, receiver)
            if sent_gas > 0:
                deposit(_type, sent_gas, receiver)

            return True

        elif operation == "release":
            if len(args) != 3 or args[0] == '' or args[1] == '' or args[2] <= 0:
                return False

            _type = args[0]
            receiver = args[1]
            amount = args[2]

            return release(_type, amount, receiver)

        elif operation == "getRate":
            if len(args) != 1 or args[0] == '':
                return False

            return get_latest_rate(args[0])

        elif operation == "updateRate":
            if len(args) != 2 or args[0] == '' or args[1] <= 0:
                return False

            return update_rate(args[0], args[1])

    print("nothing matches")
    return False


