export interface Trigger {
    id: number;
    enabled: boolean;
    code: string;
    guildId: string;
    condition: string;
    message: string;
    channelId: string;
    removeAfterExecution: boolean;
    executionTime: string;
}
