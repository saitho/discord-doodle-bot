import DoodleOption from "./option";
import DoodleComment from "./comment";
import DoodleParticipant from "./participant";

export default interface DoodleEvent {
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
    "location": {
        "name": string;
        "category": string; //"ONLINE";
    },
    "initiator": {
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
