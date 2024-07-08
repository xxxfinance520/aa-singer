import { ContractConnector } from './contracts/contractConnector';
import { OmniverseTransactionFactory } from './omniverse';
import { sleep } from '../test/utils';
import config from 'config';
import { KMSSigner } from './signer/KMSSigner';
import { LocalSigner } from './signer/localSigner';
import { Signer } from './signer/signer';

export class AASignerMain {
    contractConnector: ContractConnector;
    omniverseTxFactory: OmniverseTransactionFactory;
    signer: Signer;

    constructor() {
        this.omniverseTxFactory = new OmniverseTransactionFactory();
        this.signer = new LocalSigner();
        this.contractConnector = new ContractConnector(this.signer);
    }

    init() {}

    async mainLoop() {
        const unsignedTx = await this.contractConnector.getNextUnsignedTx();
        if (unsignedTx) {
            console.log('Unsigned transaction found', unsignedTx);
            const omniverseTx = this.omniverseTxFactory.generate(unsignedTx);
            if (omniverseTx) {
                const signedTx = await omniverseTx.getSignedData(this.signer);
                await this.contractConnector.submitTx(signedTx);
            } else {
                console.error('Generate omniverse transaction instance failed');
            }
        }
    }

    async run() {
        while (true) {
            await this.mainLoop();
            await sleep(config.get('scanInterval'));
        }
    }
}
