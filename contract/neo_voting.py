from boa.interop.Neo.Runtime import Notify, GetTrigger, Log, CheckWitness, Deserialize, Serialize
from boa.interop.Neo.Storage import Get, Put, Delete, GetContext
from boa.interop.Neo.TriggerType import Verification, Application
from boa.interop.System.ExecutionEngine import GetScriptContainer, GetExecutingScriptHash
from boa.interop.Neo.Transaction import Transaction, GetReferences
from boa.interop.Neo.Output import GetValue, GetAssetId, GetScriptHash
from boa.interop.BigInteger import BigInteger, ONE
from boa.interop.Neo.Action import RegisterAction

OnVote = RegisterAction('OnVote', 'kaiSmc', 'voter', 'candidate')


def Main(operation, args):
    if operation == "vote":
        if len(args) != 2:
            return False

        kaiSmc = args[0];
        candidateName = args[1];
        tx = GetScriptContainer()
        references = tx.References
        reference = references[0]
        voter = GetScriptHash(reference)
        context = GetContext()
        key = kaiSmc.join(candidateName)

        currentCount = Get(context, key)
        if currentCount
            currentCount = currentCount + 1
        else
            currentCount = 0
        Put(context, key, currentCount)
        OnVote(kaiSmc,voter,candidate)
        return True

    print("nothing matches")
    return False
