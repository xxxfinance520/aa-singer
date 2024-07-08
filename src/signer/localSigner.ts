import { Signer } from './signer';
import ecdsa from 'secp256k1';
import config from 'config';
export class LocalSigner implements Signer {
    constructor() {
        
    }

    async sign(hash: Buffer): Promise<{
        rc: number,
        signature: Uint8Array
    }> {
        const priKey = config.get("signer.Local.priKey")
        console.info("priKey",typeof priKey )
        const signature = ecdsa.ecdsaSign(hash, Buffer.from(priKey as string, 'hex'))
        return {
            rc: signature.recid,
            signature: signature.signature
        };
    }
}