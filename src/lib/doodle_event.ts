export enum DoodlePreferencesType {
    NO = 0,
    YESNOIFNEEDBE = 1,
    YES = 2
}

export enum DoodleState {
    OPEN = 1
}

export interface DoodleOption {
    "start": Number;
    "end": Number;
    "id":  string;
    "startDateTime": Number;
    "endDateTime": Number;
    "available": Boolean;
}

export interface DoodleComment {
    "id": Number,
    "author": string,
    "timestamp": Number,
    "text": string
}

export interface DoodleParticipant {
    "id": Number;
    "name": string;
    "preferences": Number[];
    "smallAvatarUrl": string;
    "largeAvatarUrl": string;
    "userId": string;
}

export interface DoodleEvent {
    id: string;
    latestChange: Number;
    initiated: Number;
    participantsCount: Number;
    inviteesCount: Number;
    type: string;
    timeZone: boolean;
    preferencesType: string; //DoodlePreferencesType;
    "state": string; //DoodleState,
    "locale": string;
    "title": string;
    "location":{
        "name": string;
        "category": string; //"ONLINE";
    },
    "initiator":{
        "name": string;
        "notify": boolean;
        "avatarLargeUrl": string;
        "avatarSmallUrl": string;
        "timeZone": string;
        "userId": string;
    },
    "options": DoodleOption[];
    "optionsHash": string;
    "comments": DoodleComment[],
    "participants": DoodleParticipant[],
    "device": string; //"WEB";
    "calendarEvents": any[],
    "levels": string; // DoodlePreferencesType;
    "isNewSchedulingExperience": boolean
}
