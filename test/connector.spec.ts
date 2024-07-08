import { ContractConnector } from '../src/contracts/contractConnector';
import { describe, expect, test } from '@jest/globals';
import Web3, { Contract, types } from 'web3';
import fs from 'fs';
import * as utils from './utils';
import {
    deployContract,
    sendTransaction,
    contractCall
} from '../src/utils/ethereum';
import { OmniTxType } from '../src/utils/types';
import config from 'config';
import { MockSigner } from './mocks/mockSigner';

const EVM_ADDRESS = '0x1234567812345678123456781234567812345678';
const PRIVATE_KEY =
    '0x0cc0c2de7e8c30525b4ca3b9e0b9703fb29569060d403261055481df7014f7fa';
const TX_ID =
    '0x1122334455667788112233445566778811223344556677881122334455667788';

describe('Contract connector', function () {
    let connector: ContractConnector | null = null;
    let web3: Web3 | null = null;
    let contract: Contract<any> | null = null;
    let publicKey: string;

    beforeEach(async () => {
        if (!web3) {
            await utils.launchNode();
            web3 = new Web3('http://127.0.0.1:8545');
            publicKey = web3.eth.accounts.privateKeyToPublicKey(
                PRIVATE_KEY,
                false
            );
            const address = web3.eth.accounts.privateKeyToAddress(PRIVATE_KEY);
            config.util.setPath(
                config,
                ['contracts', 'omniverseAA', 'signer'],
                address
            );
        }

        // Omniverse AA Contract
        {
            const { abi, bytecode } = JSON.parse(
                fs
                    .readFileSync('./test/res/OmniverseAABaseTest.json')
                    .toString()
            );
            contract = new web3.eth.Contract(abi, {
                data: bytecode
            });
            const ret = await deployContract(
                web3!,
                '1337',
                contract!,
                bytecode,
                PRIVATE_KEY,
                [publicKey, [], EVM_ADDRESS, EVM_ADDRESS]
            );
            contract.options.address = ret.contractAddress;
            config.util.setPath(
                config,
                ['contracts', 'omniverseAA', 'contractAddress'],
                ret.contractAddress
            );
            connector = new ContractConnector(new MockSigner(PRIVATE_KEY));
        }

        // Local entry
        {
            const { abi, bytecode } = JSON.parse(
                fs.readFileSync('./test/res/MockLocalEntry.json').toString()
            );
            const localEntry = new web3.eth.Contract(abi, {
                data: bytecode
            });
            const ret = await deployContract(
                web3!,
                '1337',
                localEntry!,
                bytecode,
                PRIVATE_KEY,
                []
            );
            localEntry.options.address = ret.contractAddress;
            await sendTransaction(
                web3!,
                '1337',
                contract!,
                'setLocalEntry',
                PRIVATE_KEY,
                [ret.contractAddress]
            );
            await sendTransaction(
                web3!,
                '1337',
                localEntry!,
                'setSubmitRet',
                PRIVATE_KEY,
                [true]
            );
        }
    });

    describe('Get next unsigned transaction', function () {
        it('should be null if there is no unsigned transactions on chain', async () => {
            const tx = await connector!.getNextUnsignedTx();
            expect(tx).toBeNull();
        });

        it('should not be null if there is any unsigned transaction on chain', async () => {
            await sendTransaction(
                web3!,
                '1337',
                contract!,
                'testAddTx',
                PRIVATE_KEY,
                [TX_ID, OmniTxType.Transfer, '0x1234']
            );
            const tx = await connector!.getNextUnsignedTx();
            expect(tx).not.toBeNull();
        });
    });

    describe('Get public key', function () {
        it('should return the public key of the aa contract', async () => {
            const pubkey = await connector!.getPubkey();
            expect(pubkey).toBe(publicKey.substring(0, 66));
        });
    });

    describe('Submit omniverse transaction', function () {
        it('should fail with not enough gas', async () => {
            await sendTransaction(
                web3!,
                '1337',
                contract!,
                'testAddTx',
                PRIVATE_KEY,
                [TX_ID, OmniTxType.Transfer, '0x1234']
            );
            await connector!.submitTx({
                txIndex: '0',
                txType: OmniTxType.Deploy,
                txData: '0x1234',
                signature: '0x1234'
            });
        });
    });
});
