import Embed from './Embed';
import { Message, User as UserOptions } from './_DiscordAPI';
export declare class User implements UserOptions {
    private token;
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
    constructor(data: UserOptions, token: string);
    dm(content: string | Embed): Promise<Message>;
}
export default User;
