import { Guild as GuildOptions, GuildHashes, Member, Channel, Role } from './_DiscordAPI';

class Guild {
    id: string;
    name: string;
    icon: string | null;
    icon_hash?: string | null;
    splash: string | null;
    discovery_splash: string | null;
    owner?: boolean;
    owner_id: string;
    permissions?: string;
    region: string;
    afk_channel_id: string | null;
    afk_timeout: number;
    widget_enabled?: boolean;
    widget_channel_id?: string;
    verification_level: number;
    description: string;
    public_updates_channel_id: string | null;
    large: boolean;
    features: any[];
    unavailable: boolean;
    member_count: number;
    max_members: number;
    guild_hashes: GuildHashes;
    system_channel_flags: number;
    premium_tier: number;
    emojis: any[];
    voice_states: any[];
    members: Map<string, Member>;
    presences: any[];
    banner: null;
    channels: Map<string, Channel>;
    max_video_channel_users: number;
    preferred_locale: string;
    rules_channel_id: null;

    roles: Role[];
    lazy: boolean;
    application_id: null;
    mfa_level: number;
    explicit_content_filter: number;
    vanity_url_code: null;
    system_channel_id: string;
    threads: any[];
    default_message_notifications: number;
    premium_subscription_count: number;
    joined_at: string;
    constructor(data: GuildOptions) {
        this.members = new Map(data.members.map(m => [m.user.id, m]));
        this.channels = new Map(data.channels.map(m => [m.id, m]));
        
    }
}
export default Guild;