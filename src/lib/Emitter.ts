/* eslint-disable @typescript-eslint/ban-ts-comment */
/******************************************************************************
 * @file src/lib/Emitter.ts
 * @fileoverview Exports the emitter class. It is the baseclass for the 
 * Client class.
 ******************************************************************************/
import {
    DiscordAPIOP as DiscordAPIOPResponse,
    GatewayEvents,
    OpCodes,
} from './_DiscordAPI';
import { erlpack, pack, unpack } from './_erlpack';
import WebSocket from 'ws';
export interface QueryOptions {
    v?: number,
    encoding?: 'json' | 'etf',
    compress?: boolean,
}

/**
 * The baseclass for the Client class.
 */
class Emitter {
    protected ws?: any;
    private OPevents: { [key: number]: (data: any) => any } = {};

    private APIEvents: { [key: string]: (data: any) => any } = {};
    private WSEvents: { [key: string]: () => any };
    protected response = {
        op: {
            emit: <T extends keyof DiscordAPIOPResponse>(
                op: T,
                d: DiscordAPIOPResponse[T]['d']
            ): void => {
                //this.ws.send(JSON.stringify({ op, d, t: null, }));
                this.ws?.send(pack({ op, d, t: null }));
            },
        },
        events: {
            emit: <T extends keyof GatewayEvents>(
                t: T,
                d: GatewayEvents[T]
            ): void => {
                // this.ws.send(JSON.stringify({ t, d, op: 0 }));
                this.ws.send(pack({ t, d, op: OpCodes.dispatch }));
            },
        },
    };
    protected connect(url: string, query?: QueryOptions): void {

        const encoding = query?.encoding || (erlpack ? 'etf' : 'json');
        if (!erlpack && encoding === 'etf') {
            throw new Error('ETF encoding selected but erlpack not found');
        }
        this.ws = new WebSocket(url + `?v=${query.v ?? 8}&encoding=${encoding}`);
        this.ws.onopen = () => {
            this.WSEvents?.open();
            this.ws.onmessage = ({ data }) => {
                const res: { op: OpCodes; t: string | null; d: unknown } = unpack(data, encoding);
                this.WSEvents?.message();
                if (res.op === OpCodes.dispatch) {
                    if (!res.t)
                        throw new Error(
                            `The event is undefined while the OP Code is 0\n ${res}`
                        );
                    if (this.APIEvents[res.t]) this.APIEvents[res.t](res.d);
                } else if (this.OPevents[res.op]) this.OPevents[res.op](res.d);
            };
        };
    }
    protected op<T extends keyof DiscordAPIOPResponse>(
        op: T,
        cb: (data: DiscordAPIOPResponse[T]['d']) => void
    ): void {
        this.OPevents[op] = cb;
    }
    protected event<T extends keyof GatewayEvents>(
        e: T,
        cb: (data: GatewayEvents[T]['d']) => void
    ): void {
        this.APIEvents[e] = cb;
    }
}
export default Emitter;
