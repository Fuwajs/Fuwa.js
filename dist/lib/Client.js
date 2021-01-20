"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Request_1 = __importDefault(require("./Request"));
const _Cache_1 = __importDefault(require("./_Cache"));
const _Debug_1 = __importDefault(require("./_Debug"));
const Errors_1 = require("./Errors");
const _DiscordAPI_1 = require("./_DiscordAPI");
const User_1 = __importDefault(require("./User"));
const _unicdi_1 = __importDefault(require("./_unicdi"));
const Response_1 = __importDefault(require("./Response"));
const Emitter_1 = __importDefault(require("./Emitter"));
const Command_1 = require("./Command");
const Embed_1 = __importDefault(require("./Embed"));
const Colors_1 = __importDefault(require("./Colors"));
const _erlpack_1 = require("./_erlpack");
var statusCode;
(function (statusCode) {
    statusCode[statusCode["playing"] = 0] = "playing";
    statusCode[statusCode["streaming"] = 1] = "streaming";
    statusCode[statusCode["listening"] = 2] = "listening";
    statusCode[statusCode["custom"] = 3] = "custom";
    statusCode[statusCode["competing"] = 4] = "competing";
})(statusCode || (statusCode = {}));
/**
 * The Client Class
 * @description The client class is the main starting point of your discord bot.
 * ```typescript
 * const fuwa = require('fuwa.js'); // Import Fuwa library
 * const client = new fuwa.Client('?'); // Create and initialize a Client
 * ```
 */
class Client extends Emitter_1.default {
    /**
     * @param prefix The prefix for your bot
     */
    constructor(prefix, options) {
        var _a, _b, _c, _d, _e;
        super();
        this.debugMode = false;
        this.sessionId = '';
        this.status = [];
        // protected events: Map<keyof Events, eventCallback> = new Map();
        /* eslint-disable */
        this.events = new Map();
        this.commands = new Map();
        this.middleware = [];
        this.options = options || {
            cache: true,
            debug: false,
            useMentionPrefix: false,
            builtinCommands: {
                help: true
            }
        };
        ((_a = this.options) === null || _a === void 0 ? void 0 : _a.debug) === false ? this.debugMode = false : this.debugMode = true;
        this.debug = new _Debug_1.default(this.debugMode);
        this.prefix = prefix;
        const caching = {
            clearAfter: ((_b = options === null || options === void 0 ? void 0 : options.cachingSettings) === null || _b === void 0 ? void 0 : _b.clearAfter) === false ? false : 1.08e+7,
            cacheOptions: ((_c = options === null || options === void 0 ? void 0 : options.cachingSettings) === null || _c === void 0 ? void 0 : _c.cacheOptions) || {
                channels: true,
                guilds: true,
                users: true
            },
        };
        this.cache = new _Cache_1.default(caching);
        this.debug;
        if ((_e = (_d = options === null || options === void 0 ? void 0 : options.builtinCommands) === null || _d === void 0 ? void 0 : _d.help) !== null && _e !== void 0 ? _e : true) {
            this.command(['help', 'commands', 'h'], (req, res) => {
                console.log('help');
                let embed = new Embed_1.default()
                    .setColor(Colors_1.default.blue)
                    .setThumbnail(this.bot.avatar);
                if (req.args.length > 0) {
                    const cmdName = req.args[0];
                    const cmd = this.commands.get(cmdName.toLowerCase());
                    if (!cmd) {
                        res.send(embed.setColor(Colors_1.default.red)
                            .setTitle('Error')
                            .setDescription(`${cmdName} is not a valid command name.`));
                        return;
                    }
                    else {
                        const fields = [
                            {
                                name: 'Example',
                                value: 'Soon'
                            }
                        ];
                        if (cmd[0].options.args) {
                            const argNames = [...cmd[0].options.args.keys()];
                            fields.push({ name: 'Arguments', value: `\`${argNames.join(', ')}\`` });
                        }
                        if (cmd[0].options.aliases) {
                            fields.push({
                                name: 'Aliases',
                                value: `\`${cmd[0].options.aliases.join(', ')}\``
                            });
                        }
                        embed
                            .setTitle(`Help | ${cmdName}`)
                            .setDescription(cmd[0].options.desc)
                            .addFields(fields);
                    }
                }
                else {
                    embed.setTitle('Help | All');
                    this.commands.forEach((cmd, name) => {
                        embed.addField({ name, value: cmd[0].options.desc });
                    });
                }
                res.send(embed);
            }, { desc: 'Get help on the usage of a command.' });
        }
    }
    /**
     * Command function
     * @param name Command name(s).
     * @param cb The function that is called when the command is ran.
     * @param  options Options for your command.
     * @returns Command Options
     * ```typescript
     * cli.command(['ping', 'latency'], (req, res) => {
     *      res.send('Pong!)
     * ```
     * });
     */
    command(name, cb, options) {
        const option = {
            desc: (options === null || options === void 0 ? void 0 : options.desc) || 'No description was provided',
            aliases: Array.isArray(name) ? name.slice(1) : []
        };
        let defaultName = Array.isArray(name) ? name.pop() : name;
        let old = this.commands.get(defaultName);
        let cmd = { cb, options: option };
        if (old) {
            old.push(cmd);
        }
        else {
            old = [cmd];
        }
        this.commands.set(defaultName, old);
        const ret = {
            addAlias: (...aliases) => {
                old[0].options.aliases.push(...aliases);
                this.commands.set(defaultName, old);
                return ret;
            },
            addArgument: (name, desc, defaultVal) => {
                let args = old[0].options.args;
                if (!args)
                    args = new Map();
                args.set(name, new Command_1.Argument(desc, defaultVal));
                this.commands.set(defaultName, old);
                return ret;
            },
        };
        return ret;
    }
    /**
     * @typeParam T The event name
     * @param cb The callback function
     * ```typescript
     * cli.on('ready', () => console.log ('Up and ready to go!'));
     * ```
     */
    on(event, cb) {
        this.events.set(event, cb);
        return this;
    }
    /**
     * A function that is ran before every command
     * @param  cb Your middleware function
     * @returns A **client** so you can *chain* methods.
     * @description
     * ```typescript
     * cli.use((req, res, next) => {
     *      req.send(`${req.command} has been used!`);
     *      next(); // call the next middlware/command
     * })
     * ```
     */
    use(cb) {
        this.middleware.push(cb);
        return this;
    }
    /**
     * options for bot status
     */
    /**
     * Log your bot into discord
     * @param token Your bot token
     * @param status Your Bot Status Options
     */
    async login(token) {
        this.debug.log('login started', 'Login is function is attempting to run...');
        const next = (req, res, arr, i = 0, secondArr) => {
            return () => {
                var _a, _b;
                if (arr[i + 1]) {
                    (_a = arr[i + 1]) === null || _a === void 0 ? void 0 : _a.cb(req, res, next(req, res, arr, i++));
                }
                else if (secondArr) {
                    (_b = secondArr[0]) === null || _b === void 0 ? void 0 : _b.cb(req, res, next(req, res, secondArr, i++));
                }
            };
        };
        this.token = token.toString();
        // console.log (`Your Bot Token: ${token.toString()}`);
        // this.connect(discordAPI.gateway);
        this.debug.log('connecting', 'Attempting to connect to discord');
        let options = {
            v: 8,
            encoding: _erlpack_1.erlpack ? 'etf' : 'json'
        };
        this.connect(_DiscordAPI_1.discordAPI.gateway, {
            v: 8,
            encoding: _erlpack_1.erlpack ? 'etf' : 'json'
        });
        this.debug.success('connected', `Connected to ${_DiscordAPI_1.discordAPI.gateway} version ${options.v}, with ${options.encoding} encoding`);
        this.op(_DiscordAPI_1.opCodes.hello, (data) => {
            this.debug.log('hello', `Recieved Hello event and recieved:\n${this.debug.object(data, 1)}`);
            this.loop = setInterval(() => this.response.op.emit(_DiscordAPI_1.opCodes.heartbeat, 251), data.heartbeat_interval);
            this.debug.log('discord login', 'Attempting to connect to discord');
            this.response.op.emit(_DiscordAPI_1.opCodes.indentify, {
                token: token.toString(),
                intents: 513,
                properties: {
                    $os: process.platform,
                    $browser: 'Fuwa.js',
                    $device: 'Fuwa.js',
                },
            });
        });
        this.op(_DiscordAPI_1.opCodes.invalidSession, () => {
            this.debug.error('invalid token', 'Invalid token was passed, throwing a error...');
            throw new Errors_1.InvalidToken('Invalid token');
        });
        this.event('READY', (data) => {
            this.debug.success('bot online', 'Logged into discord, with everything intact');
            this.sessionId = data.session_id;
            this.bot = new User_1.default(data.user, token.toString());
            data.guilds.forEach(g => g.unavailable ? '' : this.cache.cache('guilds', g));
            const ready = this.events.get('ready');
            if (ready)
                ready();
        });
        this.event('GUILD_CREATE', guild => this.cache.cache('guilds', guild));
        this.event('MESSAGE_CREATE', async (msg) => {
            var _a;
            (_a = this.events.get('message')) === null || _a === void 0 ? void 0 : _a.call(new Request_1.default(msg, this.token, this.cache), new Response_1.default(msg, this.token));
            console.time('command run');
            if (!msg.content)
                return;
            const res = new Response_1.default(msg, this.token);
            let prefix = '';
            console.time('prefix parsing');
            if (typeof this.prefix === 'function') {
                prefix = await this.prefix(new Request_1.default(msg, this.token, this.cache));
            }
            else if (Array.isArray(this.prefix)) {
                prefix = this.prefix.find((p) => msg.content.startsWith(p));
            }
            else if (typeof this.prefix === 'string') {
                prefix = this.prefix;
            }
            else {
                throw new TypeError('Invalid prefix type');
            }
            console.timeEnd('prefix parsing');
            if (!prefix)
                return;
            console.time('command parsing');
            let commandName = '';
            let args = [];
            const str = msg.content.split(' ');
            const a = this.options.useMentionPrefix && str[0] === `<@!${this.bot.id}>`;
            if (str[0][0] !== prefix && !a)
                return;
            if (this.options.debug)
                console.log(str);
            args = str.slice(a ? 2 : 1);
            commandName = (a ? str[1] : str[0])
                .replace(prefix, '')
                .toLowerCase();
            let c = [...this.commands.entries()].find(v => {
                var _a;
                if (v[0] === commandName
                    || ((_a = v[1][0]
                        .options
                        .aliases) === null || _a === void 0 ? void 0 : _a.includes(commandName))) {
                    return true;
                }
                else
                    return false;
            });
            if (!c)
                return;
            const command = c[1];
            if (!command)
                return;
            console.timeEnd('command parsing');
            console.time('middleware');
            const middlewareCommand = this.middleware.map(cb => ({ cb }));
            const req = new Request_1.default(msg, token.toString(), this.cache);
            req.args = args;
            // console.log (req)
            if (this.middleware[0]) {
                this.middleware[0](req, res, next(req, res, middlewareCommand, 0, command));
            }
            console.timeEnd('middleware');
            console.time('run command');
            if (!this.middleware[0])
                command[0].cb(req, res, next(req, res, command, 0));
            console.timeEnd('run command');
            console.timeEnd('command run');
        });
    }
    logout(end = true) {
        if ((this === null || this === void 0 ? void 0 : this.ws) && this.loop) {
            clearInterval(this.loop);
            if (end)
                process.exit();
        }
    }
    set(key, val) {
        this.options[key] = val;
        return this;
    }
    setStatus(status) {
        let cred = {
            d: {
                presence: {
                    activities: [],
                    status: 'online',
                    afk: false,
                },
            }
        };
        let activities = [
            {
                name: status.name,
            },
        ];
        activities[0] = status === null || status === void 0 ? void 0 : status.type;
        cred.d.presence.activities = activities;
        cred.d.presence.status = status.status || 'online';
        cred.d.presence.afk = status.afk || false;
        this.status = cred;
    }
    async deleteMessages(amt, channelID) {
        const msgs = await _unicdi_1.default.GET(`/channels/${channelID}/messages?limit=${amt}`, this.token).catch(e => { console.error(e); });
        _unicdi_1.default.POST(`/channels/${channelID}/messages/bulk-delete`, this.token, JSON.stringify({ messages: msgs.map(m => m.id) })).catch(e => { console.error(e); });
    }
}
exports.default = Client;
