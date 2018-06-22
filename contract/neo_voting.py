from boa.interop.Neo.Action import RegisterAction
from boa.blockchain.vm.System.ExecutionEngine import GetScriptContainer, GetExecutingScriptHash

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
        OnVote(kaiSmc,voter,candidate)
        return True

    print("nothing matches")
    return False
