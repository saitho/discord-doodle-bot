import {Trigger} from "../trigger";
import {KeyValueStorage} from "./keyvalue_storage";
import {SettingProvider} from "discord.js-commando";
import {Guild} from "discord.js";

export class TriggerStorage extends KeyValueStorage<Trigger> {
    idStorageName = 'triggers'

    constructor(provider: SettingProvider, guild: Guild) {
        super(provider, guild);
    }

    public async runMigrations() {
        // Change numeric channel IDs to Discord formatted ID with <#ID>
        for (const trigger of await this.get()) {
            if (trigger.channelId.indexOf('<') !== -1) {
                continue
            }
            trigger.channelId = `<#${trigger.channelId}>`
            await this.set(trigger)
        }
    }

    public async remove(trigger: Trigger): Promise<boolean> {
        return this.removeById(trigger.id)
    }

    public async set(trigger: Trigger) {
        await this.remove(trigger)
        await this.add(trigger)
    }

    public async removeByPollCode(pollCode: string): Promise<number> {
        const triggers: Trigger[] = await this.get();

        if (triggers.findIndex((trigger) => trigger.code === pollCode) === -1) {
            return 0;
        }
        const filteredTriggers = triggers.filter((i) => i.code !== pollCode)
        await this.provider.set(this.guild, this.idStorageName, triggers.filter((i) => i.code !== pollCode))
        return triggers.length - filteredTriggers.length;
    }

    public async removeById(triggerId: number): Promise<boolean> {
        const triggers: Trigger[] = await this.get();

        if (triggers.findIndex((trigger) => Number(trigger.id) === Number(triggerId)) === -1) {
            return false;
        }
        await this.provider.set(this.guild, this.idStorageName, triggers.filter((i) => Number(i.id) !== Number(triggerId)))
        return true;
    }

    public async getById(triggerId) {
        return (await this.get()).find((trigger) => Number(trigger.id) === Number(triggerId))
    }
}
