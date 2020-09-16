import {Trigger} from "../trigger";
import {KeyValueStorage} from "./keyvalue_storage";

export class TriggerStorage extends KeyValueStorage<Trigger> {
    idStorageName = 'triggers'

    public async set(trigger: Trigger) {
        await this.remove(trigger)
        await this.add(trigger)
    }

    public async remove(id: Trigger): Promise<boolean> {
        const polls: Trigger[] = await this.get();
        if (polls.indexOf(id) !== -1) {
            return false;
        }
        await this.provider.set(this.guild, this.idStorageName, polls.filter((item) => item.code !== id.code))
        return true;
    }

    protected async mapIdToObject(id: string) {
        return new Promise<Trigger>(async (resolve, reject) => {
            // id
        });
    }
}
