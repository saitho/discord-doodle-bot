import * as cron from "node-cron"
import {Trigger} from "./trigger";
import {TriggerExecutor} from "./trigger_executor";
import {CommandoClient} from "discord.js-commando";

export class Scheduler {
    private static instance: Scheduler;

    private tasks = new Map<Trigger, cron.Task>();

    public static getInstance(): Scheduler {
        if (!Scheduler.instance) {
            Scheduler.instance = new Scheduler();
        }
        return Scheduler.instance;
    }

    public schedule(client: CommandoClient, trigger: Trigger) {
        const oldTask = this.tasks.get(trigger)
        if (oldTask) {
            oldTask.destroy();
        }
        const task = cron.schedule(trigger.executionTime, async () => {
            await TriggerExecutor.executeSingle(client, trigger)
        });
        this.tasks.set(trigger, task)
        task.start();
    }
}
