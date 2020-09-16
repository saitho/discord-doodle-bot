import {Trigger} from "../trigger";
import {KeyValueStorage} from "./keyvalue_storage";

export class TriggerStorage extends KeyValueStorage<Trigger> {
    idStorageName = 'triggers'

    public async set(trigger: Trigger) {
        await this.remove(trigger)
        await this.add(trigger)
    }

    public async remove(id: Trigger): Promise<boolean> {
        const data: Trigger[] = await this.get()
        const newData = data.filter((item) => item.code !== id.code)
        await this.provider.set(this.guild, this.idStorageName, newData)
        return true;
    }
}
