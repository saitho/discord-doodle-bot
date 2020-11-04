import * as cron from "node-cron"
import {Trigger} from "./trigger";
import {TriggerExecutor} from "./trigger_executor";
import {CommandoClient} from "discord.js-commando";
import {getLogger} from "log4js";

export class Scheduler {
    private static instance: Scheduler;

    private tasks = new Map<Trigger, cron.Task>();

    public static getInstance(): Scheduler {
        if (!Scheduler.instance) {
            Scheduler.instance = new Scheduler();
        }
        return Scheduler.instance;
    }

    public unschedule(triggerId: string) {
        for (const trigger of this.tasks.keys()) {
            if (trigger.id !== parseInt(triggerId)) {
                continue;
            }
            this.tasks.get(trigger).destroy();
            this.tasks.delete(trigger)
        }
    }

    public schedule(client: CommandoClient, trigger: Trigger) {
        getLogger().debug('Scheduling trigger', trigger)
        const oldTask = this.tasks.get(trigger)
        if (oldTask) {
            getLogger().debug('Removed old task before rescheduling trigger')
            oldTask.destroy();
        }
        const task = cron.schedule(trigger.executionTime, async () => {
            await TriggerExecutor.executeSingle(client, trigger)
        });
        this.tasks.set(trigger, task)
        getLogger().debug('Starting task', task)
        task.start();
    }
}
