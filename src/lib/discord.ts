export interface ExtractResult {
    channelId: string;
    channelType: "channel"|"user"|""
}

export class DiscordUtility {
    public extractChannelId(channelString: string): ExtractResult {
        let channelId = '', channelType;

        const matchChannelResult = channelString.match(/^<#(\d+)>$/)
        const matchUserResult = channelString.match(/^<@!(\d+)>$/)

        if (matchChannelResult) {
            channelId = matchChannelResult[1]
            channelType = 'channel'
        } else if (matchUserResult) {
            channelId = matchUserResult[1]
            channelType = 'user'
        } else {
            channelType = ''
        }

        return { channelId, channelType }
    }
}
