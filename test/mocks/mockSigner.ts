import { Signer } from '../../src/signer/signer';
import secp from 'secp256k1';

export class MockSigner implements Signer {
    priKey: Uint8Array;

    constructor(sk: string) {
        this.priKey = Uint8Array.from(Buffer.from(sk.substring(2), 'hex'));
    }

    async sign(hash: Buffer): Promise<string> {
        let sig = secp.ecdsaSign(Uint8Array.from(hash), this.priKey);
        let recid = Buffer.from('00', 'hex');
        if (sig.recid == 1) {
            recid = Buffer.from('01', 'hex');
        }
        return Buffer.concat([Buffer.from(sig.signature), recid]).toString(
            'hex'
        );
    }
}
