import {CommandoClient} from "discord.js-commando";

export class UserConditions {
    protected client: CommandoClient

    constructor(client: CommandoClient) {
        this.client = client
    }

    public mention(userName: string): string {
        const user = this.client.users.find(value => value.username === userName)
        return `<@${user.id}>`
    }
}
