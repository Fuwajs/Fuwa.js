"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-async-promise-executor */ // should be fixed soon
const undici_1 = require("undici");
const _DiscordAPI_1 = require("./_DiscordAPI");
const http = new undici_1.Client(_DiscordAPI_1.discordAPI.discord);
exports.default = {
    /**
     * Use this if you want to handle Discord Rate limits automatically.
     *!! Be aware that this function is **recursive**
     */
    REQUEST(method, path, token, data) {
        return new Promise(async (resolve, reject) => {
            const params = {
                path: '/api/v8' + path,
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data
            };
            if (token)
                params.headers.authorization = `Bot ${token}`;
            const res = await http.request(params);
            const chunks = [];
            res.body.on('data', (chunk) => chunks.push(chunk));
            res.body.on('end', () => {
                let d;
                if (!Buffer.concat(chunks).toString())
                    resolve({});
                try {
                    d = JSON.parse(Buffer.concat(chunks).toString());
                }
                catch (e) {
                    reject(e);
                }
                if (res.statusCode === 429) { // Handle Discord Rate Limits
                    setTimeout(() => {
                        this.REQUEST(method, path, token, data)
                            .catch(e => console.error(e));
                    }, (d === null || d === void 0 ? void 0 : d.retry_after) * 1000);
                }
                resolve(d);
            });
        });
    },
    GET(path, token) {
        return this.REQUEST('GET', path, token);
    },
    DELETE(path, token) {
        return this.REQUEST('DELETE', path, token);
    },
    POST(path, token, data) {
        return this.REQUEST('POST', path, token, data);
    },
    PUT(path, token, data) {
        return this.REQUEST('PUT', path, token, data);
    }
};
