import { describe, expect, test } from '@jest/globals';
import {
    OmniverseTransactionFactory,
    OmniverseDeploy,
    OmniverseMint,
    OmniverseTransfer
} from '../src/omniverse';
import * as utils from './utils';
import { OmniTxType, Deploy, Mint, Transfer } from '../src/utils/types';
import { MockSigner } from './mocks/mockSigner';

const PRIVATE_KEY =
    '0x0cc0c2de7e8c30525b4ca3b9e0b9703fb29569060d403261055481df7014f7fa';
const UTXO_INDEX = '287454020';
const TOKEN_ASSET_ID =
    '0x0000000000000000000000000000000000000000000000000000000000000001';
const TX_ID =
    '0x1122334455667788112233445566778811223344556677881122334455667788';
const SIGNATURE =
    '0x3a42c95c375c019bb6dfdac8bc15bb06de455ce88edb211756d3edea69dbdc526d4f8b99ad86f33b07137649d6c8ef78b398e95d6a21748ae00db750e3814f7b1c';
// default metadata
const METADATA_SALT = '0x1122334455667788';
const METADATA_NAME = 'test_token';
const METADATA_TOTAL_SUPPLY = '1234605616436508552';
const METADATA_LIMIT = '1234605616436508552';
const METADATA_PRICE = '1234605616436508552';
const OMNI_ADDRESS =
    '0x1234567812345678123456781234567812345678123456781234567812345678';
const TOKEN_NUM = '1234605616436508552';

async function getDeployData() {
    let deploy: Deploy = {
        metadata: {
            salt: METADATA_SALT,
            name: METADATA_NAME,
            deployer: OMNI_ADDRESS,
            totalSupply: METADATA_TOTAL_SUPPLY,
            limit: METADATA_LIMIT,
            price: METADATA_PRICE
        },
        signature: SIGNATURE,
        feeInputs: [
            {
                txid: TX_ID,
                index: UTXO_INDEX,
                amount: TOKEN_NUM,
                address: OMNI_ADDRESS
            }
        ],
        feeOutputs: []
    };
    const encoded = utils.encodeDeploy(deploy);
    return encoded;
}

async function getMintData() {
    let mint: Mint = {
        assetId: TOKEN_ASSET_ID,
        signature: SIGNATURE,
        outputs: [
            {
                address: OMNI_ADDRESS,
                amount: TOKEN_NUM
            }
        ],
        feeInputs: [
            {
                txid: TX_ID,
                index: UTXO_INDEX,
                amount: TOKEN_NUM,
                address: OMNI_ADDRESS
            }
        ],
        feeOutputs: [
            {
                address: OMNI_ADDRESS,
                amount: TOKEN_NUM
            }
        ]
    };
    const encoded = utils.encodeMint(mint);
    return encoded;
}

async function getTransferData() {
    let transfer: Transfer = {
        assetId: TOKEN_ASSET_ID,
        signature: SIGNATURE,
        inputs: [
            {
                txid: TX_ID,
                index: UTXO_INDEX,
                amount: TOKEN_NUM,
                address: OMNI_ADDRESS
            }
        ],
        outputs: [
            {
                address: OMNI_ADDRESS,
                amount: TOKEN_NUM
            }
        ],
        feeInputs: [
            {
                txid: TX_ID,
                index: UTXO_INDEX,
                amount: TOKEN_NUM,
                address: OMNI_ADDRESS
            }
        ],
        feeOutputs: [
            {
                address: OMNI_ADDRESS,
                amount: TOKEN_NUM
            }
        ]
    };
    const encoded = utils.encodeTransfer(transfer);
    return encoded;
}

describe('Omniverse Deploy', function () {
    it('should throw when transaction data error', () => {
        expect(() => {
            new OmniverseDeploy('0', '0x');
        }).toThrow('Deploy transaction data error');
    });

    describe('Get EIP712 hash', function () {
        it(`should be calculate correctly`, async () => {
            let encoded = await getDeployData();
            let deploy = new OmniverseDeploy('0', encoded);
            expect(deploy.getEIP712Hash()).toBe(
                'f1c320ff502d9be191921b99054fc53e71c7036ff54a626b2536f925da1421ad'
            );
        });
    });

    describe('Get transaction type', function () {
        it('should return Deploy type', async () => {
            let encoded = await getDeployData();
            let otx = new OmniverseDeploy('0', encoded);
            expect(otx.getTxType()).toBe(OmniTxType.Deploy);
        });
    });

    describe('Get signed data', function () {
        it('should return transaction data with signature', async () => {
            let encoded = await getDeployData();
            let otx = new OmniverseDeploy('0', encoded);
            const signedTx = await otx.getSignedData(
                new MockSigner(PRIVATE_KEY)
            );
            expect(signedTx.txType).toBe(OmniTxType.Deploy);
        });
    });
});

describe('Omniverse Mint', function () {
    it('should throw when transaction data error', async () => {
        expect(() => {
            new OmniverseMint('0', '0x');
        }).toThrowError(new Error('Mint transaction data error'));
    });

    describe('Get EIP712 hash', function () {
        it(`should be calculate correctly`, async () => {
            let encoded = await getMintData();
            let otx = new OmniverseMint('0', encoded);
            expect(otx.getEIP712Hash()).toBe(
                '42d07ab1ecf3d6d4acf56e6b6fb9d492eff1c3cb083468ed188c84ed9683a216'
            );
        });
    });

    describe('Get transaction type', function () {
        it('should return Deploy type', async () => {
            let encoded = await getMintData();
            let otx = new OmniverseMint('0', encoded);
            expect(otx.getTxType()).toBe(OmniTxType.Mint);
        });
    });

    describe('Get signed data', function () {
        it('should return transaction data with signature', async () => {
            let encoded = await getMintData();
            let otx = new OmniverseMint('0', encoded);
            const signedTx = await otx.getSignedData(
                new MockSigner(PRIVATE_KEY)
            );
            expect(signedTx.txType).toBe(OmniTxType.Mint);
        });
    });
});

describe('Omniverse Transfer', function () {
    it('should throw when transaction data error', async () => {
        expect(() => {
            new OmniverseTransfer('0', '0x');
        }).toThrowError(new Error('Transfer transaction data error'));
    });

    describe('Get EIP712 hash', function () {
        it(`should be calculate correctly`, async () => {
            let encoded = await getTransferData();
            let otx = new OmniverseTransfer('0', encoded);
            expect(otx.getEIP712Hash()).toBe(
                '77cd8793665bcbb5a7dced1c9c8e5fb80796777efc911405e0156993b0465482'
            );
        });
    });

    describe('Get transaction type', function () {
        it('should return Transfer type', async () => {
            let encoded = await getTransferData();
            let otx = new OmniverseTransfer('0', encoded);
            expect(otx.getTxType()).toBe(OmniTxType.Transfer);
        });
    });

    describe('Get signed data', function () {
        it('should return transaction data with signature', async () => {
            let encoded = await getTransferData();
            let otx = new OmniverseTransfer('0', encoded);
            const signedTx = await otx.getSignedData(
                new MockSigner(PRIVATE_KEY)
            );
            expect(signedTx.txType).toBe(OmniTxType.Transfer);
        });
    });
});

describe('Omniverse transaction factory', function () {
    describe('Generate Omniverse transaction from encoded data', function () {
        it('should generate Omniverse Deploy transaction successfully', async () => {
            let encoded = await getDeployData();
            let factory = new OmniverseTransactionFactory();
            const otx = factory.generate({
                txIndex: '0',
                txType: OmniTxType.Deploy,
                txData: encoded
            });
            expect(otx!.getTxType()).toBe(OmniTxType.Deploy);
        });

        it('should generate Omniverse Mint transaction successfully', async () => {
            let encoded = await getMintData();
            let factory = new OmniverseTransactionFactory();
            const otx = factory.generate({
                txIndex: '0',
                txType: OmniTxType.Mint,
                txData: encoded
            });
            expect(otx!.getTxType()).toBe(OmniTxType.Mint);
        });

        it('should generate Omniverse Transfer transaction successfully', async () => {
            let encoded = await getTransferData();
            let factory = new OmniverseTransactionFactory();
            const otx = factory.generate({
                txIndex: '0',
                txType: OmniTxType.Transfer,
                txData: encoded
            });
            expect(otx!.getTxType()).toBe(OmniTxType.Transfer);
        });
    });
});
