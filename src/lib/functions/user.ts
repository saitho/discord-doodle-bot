import {CommandoClient} from "discord.js-commando";
import {Guild} from "discord.js";

export class User {
    protected client: CommandoClient
    protected guild: Guild

    constructor(client: CommandoClient, guild: Guild) {
        this.client = client
        this.guild = guild
    }

    public mention(userName: string) {
        const user = this.guild.members.find((user) => user.user.username === userName)
        if (!user) {
            return ``
        }
        return `<@${user.id}>`
    }
}
