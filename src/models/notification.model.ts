import mongoose from 'mongoose';
import { ENUM } from '@common';

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['interest', 'message', 'review', 'job_offer'] },
    content: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: ENUM.COL.NOTIFICATION,
  },
);

const Notification = mongoose.model(ENUM.COL.NOTIFICATION, NotificationSchema);

export default Notification;
