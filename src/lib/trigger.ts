export interface Trigger {
    code: string;
    guildId: string;
    condition: string;
    message: string;
    channelId: string;
    removeAfterExecution: boolean;
    executionTime: string;
}
