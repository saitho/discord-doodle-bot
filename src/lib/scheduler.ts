import * as cron from "node-cron"
import {Trigger} from "./trigger";
import {TriggerExecutor} from "./trigger_executor";
import {CommandoClient} from "discord.js-commando";
import {getLogger} from "log4js";

export class Scheduler {
    private static instance: Scheduler;

    private tasks = new Map<Trigger, cron.Task[]>();

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
            for (const task of this.tasks.get(trigger)!) {
                task.destroy();
            }
            this.tasks.delete(trigger)
        }
    }

    public schedule(client: CommandoClient, trigger: Trigger) {
        getLogger().debug('Scheduling trigger', trigger)
        const oldTasks = this.tasks.get(trigger)
        if (oldTasks) {
            getLogger().debug('Removed old task before rescheduling trigger')
            for (const task of oldTasks) {
                task.destroy();
            }
        }
        const tasks: cron.Task[] = [];
        for (const executionTime of trigger.executionTime.split(';')) {
            const task = cron.schedule(trigger.executionTime, async () => {
                await TriggerExecutor.executeSingle(client, trigger)
            });
            getLogger().debug('Starting task for trigger ' + trigger.id + ' at ' + executionTime, task)
            task.start()
            tasks.push(task)
        }
        this.tasks.set(trigger, tasks)
    }
}
