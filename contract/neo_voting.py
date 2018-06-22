from boa.interop.Neo.Action import RegisterAction
from boa.blockchain.vm.System.ExecutionEngine import GetScriptContainer, GetExecutingScriptHash
from boa.blockchain.vm.Neo.Storage import GetContext, Get, Put, Delete

OnVote = RegisterAction('OnVote', 'kaiSmc', 'voter', 'candidate')


def Main(operation, args):
    if operation == "deposit":
        if(len(args) != 2):
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
