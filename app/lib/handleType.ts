import { User } from "next-auth";
export type SessionUserType = {
    name?: string;
    image?: string;
    email?: string;
    id?: string;
};
export type AdminType={
    id:string;
    name:string;
}
export type JoinRoomType={
    name?:string;
    userId?:string;
    roomId?:string;
    image?:string;
}
export type AddRoomType={
    name?:string;
    userId?:string;
    image?:string;
}
export enum SupportedMessage {
    GetAndNotify="GET_AND_NOTIFY",
    AddRoom="ADD_ROOM",
    JoinRoom =  "JOIN_ROOM",
    SendMessage = "SEND_MESSAGE",
    CreateBattle = "CREATE_BATTLE",
    StartBattle="START_BATTLE",
    UpdatePos="UPDATE_POS",
    UpdateBattleInfo="UPDATE_BATTLE_INFO"
}
export type BattleProps ={
    str: string;
    roomId: string;
    users: User[];
    user: User;
    isAdmin: boolean;
    testDuration: number;
}
export type WordsDisplayProps = { str: string, caretPos: { wordIndex: number, letterIndex: number }, playersCaretPos: PlayerCaretPosType, typedStatus: TypedStatusType };
// Utility types
export type PlayerCaretPosType = {
    [name: string]: {
        wordIndex: number;
        letterIndex: number;
    };
};
export type ResultType={
    id:string,
    name:string,
    image:string,
    netWpm:number;
    acc:number;
    tot_chars_typed:number;
    crct_chars_typed:number;
    wrng_chars_typed:number;
}
export type TypedStatusType = { [letterIndex: number]: string }[];

export type UserType = {
    name: string;
    image: string;
    id: string;
};
export type ActiveItemType = {
    section: string;
    text: string;
  }