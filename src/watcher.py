import os
import subprocess
from logzero import logger
from src.smartcontract import SmartContract
from boa.interop.BigInteger import BigInteger


dir_current = os.path.dirname(os.path.abspath(__file__))
ROOT_INSTALL_PATH = os.path.abspath(os.path.join(dir_current, ".."))
COMMAND = os.path.join(ROOT_INSTALL_PATH, "node/cmd.js")


class Watcher:

    @staticmethod
    def newInstance():
        # Setup the smart contract instance
        smart_contract = SmartContract()

        # Register an event handler for Runtime.Notify events of the smart contract.
        @smart_contract.on_notify
        def sc_notify(event):
            payload = event.event_payload
            logger.info(event)

            if len(payload) == 0:
                return

            action = payload[0]

            if action == b'OnDeposit':
                on_release(payload[1:])

        @smart_contract.on_execution
        def sc_execution(event):
            logger.info(event)

        @smart_contract.on_storage
        def sc_storage(event):
            logger.info(event)

        @smart_contract.on_log
        def sc_log(msg):
            logger.info("SmartContract Runtime.Log event: %s", msg)


def on_release(data):
    if len(data) != 4:
        logger.info("OnDeposit - Invalid data length - %s", data)

    _type = data[0]
    amount = data[1] / (10**8)
    receiver = data[2]
    rate = BigInteger.FromBytes(data[3]) / (10**8)
    to_transfer = amount * rate
    logger.info("OnDeposit - toTransfer - {}".format(to_transfer))

    if _type.lower() in [b"3", b"4", b"5"]:

        subprocess.call([
            "node",
            COMMAND,
            "--handler=release",
            "--released-type={}".format(_type.decode('utf-8')),
            "--amount={}".format(to_transfer),
            "--receiver={}".format(receiver.decode('utf-8')),
            "--environment=docker"
        ])

