import {KeyValueStorage} from "./keyvalue_storage";
import {getLogger} from "log4js";

export abstract class ObjectStorage<T, V> extends KeyValueStorage<V> {
    protected abstract objectStoragePrefix: string

    public async find(id: V): Promise<T> {
        return this.provider.get(this.guild, this.objectStoragePrefix + id) || null
    }

    public async add(id: V): Promise<boolean> {
        if (!await super.add(id)) {
            return false
        }
        await this.provider.set(this.guild, this.objectStoragePrefix + id, await this.mapIdToObject(id))
        return true;
    }

    protected abstract mapIdToObject(id: V): Promise<T>;

    public async update(id: V): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            const items: V[] = await this.get()
            if (items.indexOf(id) === -1) {
                reject(null)
            }
            const result = await this.mapIdToObject(id)
            getLogger().debug(`Updating object "${this.objectStoragePrefix + id}"`, id)
            await this.provider.set(this.guild, this.objectStoragePrefix + id, result)
            resolve(result)
        })
    }

    public async remove(id: V): Promise<boolean> {
        if (!await super.remove(id)) {
            return false
        }
        await this.provider.remove(this.guild, this.objectStoragePrefix + id)
        return true;
    }
}
