export class JsonRpcClient {
    addr: string;
    port: number;

    constructor() {
        this.addr = "";
        this.port = 0;
    }

    /**
     * @notice Send rpc request to server
     * @param method Method name
     * @param param Parameters
     * @return Response value
     */
    request(method: string, param: Array<any>): any {
        return null;
    }
}