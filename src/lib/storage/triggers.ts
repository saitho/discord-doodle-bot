import {Trigger} from "../trigger";
import {KeyValueStorage} from "./keyvalue_storage";

export class TriggerStorage extends KeyValueStorage<Trigger> {
    idStorageName = 'triggers'

    public async set(trigger: Trigger) {
        await this.remove(trigger)
        await this.add(trigger)
    }

    protected async mapIdToObject(id: string) {
        return new Promise<Trigger>(async (resolve, reject) => {
            // id
        });
    }
}
