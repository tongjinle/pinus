
export interface IPushScheduler
{

    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    start():Promise<void>;

    /**
     * Component lifecycle function
     *
     * @param {Boolean}  force whether stop the component immediately
     * @param {Function}  cb
     * @return {Void}
     */
    stop():Promise<void>;

    /**
     * 调度发生时调用
     */
    schedule(reqId : number, route : string, msg : any, recvs : number[], opts : any, cb : Function):void;
}