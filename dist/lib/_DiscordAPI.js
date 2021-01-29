"use strict";
/******************************************************************************
 * Discord API interfaces
 * @see https://discord.com/developers/docs
 * @file src/lib/_DiscordAPI.ts
 *****************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelType = exports.ActivityType = exports.discordCDN = exports.discordAPI = exports.OpCodes = void 0;
/**
 * @see https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes
 */
var OpCodes;
(function (OpCodes) {
    OpCodes[OpCodes["dispatch"] = 0] = "dispatch";
    OpCodes[OpCodes["heartbeat"] = 1] = "heartbeat";
    OpCodes[OpCodes["indentify"] = 2] = "indentify";
    OpCodes[OpCodes["statusUpdate"] = 3] = "statusUpdate";
    OpCodes[OpCodes["voiceStateUpdate"] = 4] = "voiceStateUpdate";
    OpCodes[OpCodes["voiceGuildPing"] = 5] = "voiceGuildPing";
    OpCodes[OpCodes["resume"] = 6] = "resume";
    OpCodes[OpCodes["reconnect"] = 7] = "reconnect";
    OpCodes[OpCodes["requestGuildMembers"] = 8] = "requestGuildMembers";
    OpCodes[OpCodes["invalidSession"] = 9] = "invalidSession";
    OpCodes[OpCodes["hello"] = 10] = "hello";
    OpCodes[OpCodes["heartbeatAck"] = 11] = "heartbeatAck";
})(OpCodes = exports.OpCodes || (exports.OpCodes = {}));
exports.discordAPI = {
    gateway: 'wss://gateway.discord.gg/',
    api: `https://discord.com/api/v8/`,
    discord: 'https://discord.com',
};
exports.discordCDN = 'https://cdn.discordapp.com';
var StickerFormat;
(function (StickerFormat) {
    StickerFormat[StickerFormat["png"] = 1] = "png";
    StickerFormat[StickerFormat["apng"] = 2] = "apng";
    StickerFormat[StickerFormat["lottie"] = 3] = "lottie";
})(StickerFormat || (StickerFormat = {}));
var MessageType;
(function (MessageType) {
    MessageType[MessageType["default"] = 0] = "default";
    MessageType[MessageType["recipientAdd"] = 1] = "recipientAdd";
    MessageType[MessageType["recipientRemove"] = 2] = "recipientRemove";
    MessageType[MessageType["call"] = 3] = "call";
    MessageType[MessageType["channelNameChange"] = 4] = "channelNameChange";
    MessageType[MessageType["channelIconChange"] = 5] = "channelIconChange";
    MessageType[MessageType["channelPinnedMessage"] = 6] = "channelPinnedMessage";
    MessageType[MessageType["guildMemberJoin"] = 7] = "guildMemberJoin";
    MessageType[MessageType["userPremiumGuildSubscription"] = 8] = "userPremiumGuildSubscription";
    MessageType[MessageType["userPremiumGuildSubscriptionTier1"] = 9] = "userPremiumGuildSubscriptionTier1";
    MessageType[MessageType["userPremiumGuildSubscriptionTier2"] = 10] = "userPremiumGuildSubscriptionTier2";
    MessageType[MessageType["userPremiumGuildSubscriptionTier3"] = 11] = "userPremiumGuildSubscriptionTier3";
    MessageType[MessageType["channelFollowAdd"] = 12] = "channelFollowAdd";
    MessageType[MessageType["guildFollowAdd"] = 13] = "guildFollowAdd";
    MessageType[MessageType["guildDiscorveryDisqualified"] = 14] = "guildDiscorveryDisqualified";
    MessageType[MessageType["guildDiscoveryRequalified"] = 15] = "guildDiscoveryRequalified";
    MessageType[MessageType["reply"] = 16] = "reply";
    MessageType[MessageType["applicationCommand"] = 17] = "applicationCommand";
})(MessageType || (MessageType = {}));
/**
 * @see https://discord.com/developers/docs/topics/gateway#activity-object-activity-types
 */
var ActivityType;
(function (ActivityType) {
    ActivityType[ActivityType["game"] = 0] = "game";
    ActivityType[ActivityType["streaming"] = 1] = "streaming";
    ActivityType[ActivityType["listening"] = 2] = "listening";
    ActivityType[ActivityType["custom"] = 3] = "custom";
    ActivityType[ActivityType["competing"] = 4] = "competing";
})(ActivityType = exports.ActivityType || (exports.ActivityType = {}));
/**
 * @see https://discord.com/developers/docs/topics/gateway#activity-object-activity-flags
 */
var ActivityFlags;
(function (ActivityFlags) {
    ActivityFlags[ActivityFlags["instance"] = 1] = "instance";
    ActivityFlags[ActivityFlags["join"] = 2] = "join";
    ActivityFlags[ActivityFlags["spectate"] = 4] = "spectate";
    ActivityFlags[ActivityFlags["joinRequest"] = 8] = "joinRequest";
    ActivityFlags[ActivityFlags["sync"] = 16] = "sync";
    ActivityFlags[ActivityFlags["play"] = 32] = "play";
})(ActivityFlags || (ActivityFlags = {}));
var ChannelType;
(function (ChannelType) {
    ChannelType[ChannelType["text"] = 0] = "text";
    ChannelType[ChannelType["dm"] = 1] = "dm";
    ChannelType[ChannelType["voice"] = 2] = "voice";
    ChannelType[ChannelType["groupDM"] = 3] = "groupDM";
    ChannelType[ChannelType["catergory"] = 4] = "catergory";
    ChannelType[ChannelType["news"] = 5] = "news";
    ChannelType[ChannelType["store"] = 6] = "store";
})(ChannelType = exports.ChannelType || (exports.ChannelType = {}));
