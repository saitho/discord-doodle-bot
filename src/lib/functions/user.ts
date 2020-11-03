import {CommandoClient} from "discord.js-commando";
import {GuildMember, Snowflake} from "discord.js";

export class User {
    protected client: CommandoClient
    protected guildMembers: Map<Snowflake, GuildMember>

    constructor(client: CommandoClient, guildMembers: Map<Snowflake, GuildMember>) {
        this.client = client
        this.guildMembers = guildMembers
    }

    public mention(userName: string) {
        const user = this.guildMembers.get(userName)
        if (!user) {
            return ``
        }
        return `<@${user.id}>`
    }
}
