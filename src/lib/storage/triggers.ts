import {Trigger} from "../trigger";
import {KeyValueStorage} from "./keyvalue_storage";

export class TriggerStorage extends KeyValueStorage<Trigger> {
    idStorageName = 'triggers'

    public async remove(trigger: Trigger): Promise<boolean> {
        return this.removeById(trigger.id)
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

    protected async mapIdToObject(triggerId: number) {
        return (await this.get()).find((trigger) => Number(trigger.id) === Number(triggerId))
    }
}
