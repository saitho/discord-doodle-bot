export interface Trigger {
    code: string;
    condition: string;
    message: string;
    channelId: string;
    removeAfterExecution: boolean;
}
