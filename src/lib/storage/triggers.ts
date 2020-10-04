import {Trigger} from "../trigger";
import {KeyValueStorage} from "./keyvalue_storage";

export class TriggerStorage extends KeyValueStorage<Trigger> {
    idStorageName = 'triggers'

    public async remove(trigger: Trigger): Promise<boolean> {
        return this.removeById(trigger.id)
    }

    public async removeById(triggerId: number): Promise<boolean> {
        const triggers: Trigger[] = await this.get();

        if (triggers.findIndex((trigger) => trigger.id === triggerId) !== -1) {
            return false;
        }
        await this.provider.set(this.guild, this.idStorageName, triggers.filter((item) => item.id !== triggerId))
        return true;
    }

    protected async mapIdToObject(triggerId: number) {
        return (await this.get()).find((trigger) => trigger.id === triggerId)
    }
}
