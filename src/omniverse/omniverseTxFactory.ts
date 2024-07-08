import { UnsignedTx, OmniTxType } from '../utils/types';
import { OmniverseTx } from './omniverseTxBase';
import OmniverseDeploy from './omniverseDeploy';
import OmniverseMint from './omniverseMint';
import OmniverseTransfer from './omniverseTransfer';

export default class OmniverseTransactionFactory {
    constructor() {}

    /**
     * @notice Generate Omniverse transaction instance from raw transaction data
     * @param tx Unsigned transaction data fetched from chain
     * @return Omniverse transaction instance
     */
    generate(tx: UnsignedTx): OmniverseTx | null {
        let ret: OmniverseTx | null = null;
        if (tx.txType == OmniTxType.Deploy) {
            ret = new OmniverseDeploy(tx.txIndex, tx.txData);
        } else if (tx.txType == OmniTxType.Mint) {
            ret = new OmniverseMint(tx.txIndex, tx.txData);
        } else if (tx.txType == OmniTxType.Transfer) {
            ret = new OmniverseTransfer(tx.txIndex, tx.txData);
        }
        return ret;
    }
}

//SELECT * FROM `stats_user_staking_daily` WHERE day_time="2024-07-02 00:00:00" and state = 1;
// update `stats_user_staking_daily` set state =0,team_staking_node_user=0,team_staking_normal_user=0 WHERE day_time="2024-07-02 00:00:00" and state = 1
