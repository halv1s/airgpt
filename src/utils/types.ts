export enum MessageSender {
    System = "system",
    Assistant = "assistant",
    User = "user",
}

export interface IChat {
    id: string;
    userId: string;
}

export interface IMessage {
    id: string;
    chatId: string;
    sender: MessageSender;
    content: string;
    timestamp: Date;
}
