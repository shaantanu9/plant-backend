// import { Model } from "mongoose";
// import BaseEntity from "./base.entity";
// import MessageModel from "@models/message.model"; // Import your Message model
// import { toObjectId } from "@utils";

// class MessageEntity extends BaseEntity {
//   constructor(model: Model<any>) {
//     super(model);
//   }

//   // Create a new message
//   public async createMessage(data: any) {
//     return this.create(data);
//   }

//   // Find message by ID
//   public async findMessageById(messageId: string) {
//     return this.findOne({ _id: toObjectId(messageId) });
//   }

//   // Find messages between two users
//   public async findMessagesBetween(senderId: string, receiverId: string, limit: number = 50) {
//     const res :any= await this.find({
//       $or: [
//         { senderId: toObjectId(senderId), receiverId: toObjectId(receiverId) },
//         { senderId: toObjectId(receiverId), receiverId: toObjectId(senderId) },
//       ],
//     })
//     const messages = res.sort({ sentAt: 1 }).limit(limit);
//     return messages;
//   }

//   // Find unread messages for a user
//   public async findUnreadMessagesForUser(userId: string) {
//     return this.find({ receiverId: toObjectId(userId), isRead: false });
//   }

//   // Update message status to read
//   public async markMessageAsRead(messageId: string) {
//     return this.updateOne({ _id: toObjectId(messageId) }, { $set: { isRead: true } });
//   }

//   // Update multiple messages as read
//   public async markMessagesAsReadForUser(userId: string) {
//     return this.updateMany({ receiverId: toObjectId(userId), isRead: false }, { $set: { isRead: true } });
//   }

//   // Broadcast a new message using socket.io
//   public async broadcastNewMessage(message: any, io: any) {
//     // Save the message to the database
//     const savedMessage = await this.createMessage(message);

//     // Emit the message to both the sender and receiver
//     io.to(`user_${message.receiverId}`).emit("newMessage", savedMessage);
//     io.to(`user_${message.senderId}`).emit("newMessage", savedMessage);

//     return savedMessage;
//   }
// }

// export const MessageEntities = new MessageEntity(MessageModel);
