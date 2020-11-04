import {Guild} from "discord.js";
import {SettingProvider} from "discord.js-commando";
import {getLogger} from "log4js";

export abstract class KeyValueStorage<V> {
    protected provider: SettingProvider;
    protected guild: Guild;

    public constructor(provider: SettingProvider, guild: Guild) {
        this.provider = provider;
        this.guild = guild;
    }

    protected abstract idStorageName: string

    public async get(): Promise<V[]> {
        return this.provider.get(this.guild, this.idStorageName) ?? []
    }

    public async add(id: V): Promise<boolean> {
        const items: V[] = await this.get();
        if (items.indexOf(id) !== -1) {
            return false;
        }
        getLogger().debug(`Adding data to storage "${this.idStorageName}"`, id)
        await this.provider.set(this.guild, this.idStorageName, [...items, id])
        return true;
    }

    public async remove(id: V): Promise<boolean> {
        const polls: V[] = await this.get();
        if (polls.indexOf(id) !== -1) {
            return false;
        }
        getLogger().debug(`Removing data from storage "${this.idStorageName}"`, id)
        await this.provider.set(this.guild, this.idStorageName, polls.filter((item) => item !== id))
        return true;
    }
}
