import {CommandoClient as DiscordCommandoClient, CommandoClientOptions, SQLiteProvider} from "discord.js-commando";
import {ChildProcess, fork} from "child_process";
import {Guild} from "discord.js";
import path from "path";
import sqlite from "sqlite";

export class CommandoClient extends DiscordCommandoClient {
    private _triggerExecutor = new Map<string, ChildProcess>();

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

    launchTriggerExecutor(guild: Guild): ChildProcess|undefined {
        if (this._triggerExecutor.has(guild.id)) {
            return this._triggerExecutor.get(guild.id);
        }
        const process = fork(path.join(__dirname, 'triggerexecutor.js'), ['--guildId=' + guild.id]);
        this._triggerExecutor.set(guild.id, process);
        return process
    }

    getTriggerExecutor(guild: Guild): ChildProcess|undefined {
        if (!this._triggerExecutor.has(guild.id)) {
            return undefined;
        }
        return this._triggerExecutor.get(guild.id);
    }

    removeTriggerExecutor(guild: Guild): void {
        if (!this._triggerExecutor.has(guild.id)) {
            return;
        }
        this.getTriggerExecutor(guild)?.kill("SIGTERM")
    }

    removeTriggerExecutors(): void {
        this.guilds.forEach((g) => {
            this.removeTriggerExecutor(g)
        });
    }
}
