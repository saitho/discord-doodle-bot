import {CommandoClient as DiscordCommandoClient, SQLiteProvider} from "discord.js-commando";
import path from "path";
import sqlite from "sqlite";
import {Scheduler} from "./scheduler";

export class CommandoClient extends DiscordCommandoClient {
    init() {
        return new Promise<void>((resolve, reject) => {
            sqlite.open(path.join(__dirname, '..', 'database.sqlite3'))
                .then(async (database) => {
                    const provider = new SQLiteProvider(database)
                    await provider.init(this)
                    await this.setProvider(provider)
                })
                .catch((e) => reject(`Failed to connect to database: ${e}`))
        })
    }
}
