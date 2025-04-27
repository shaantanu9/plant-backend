import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  date: { type: Date, required: true },
  totalDeliveries: { type: Number, default: 0 },
  completedDeliveries: { type: Number, default: 0 },
  missedDeliveries: { type: Number, default: 0 },
  containersDelivered: { type: Number, default: 0 },
  containersReturned: { type: Number, default: 0 },
  pendingContainers: { type: Number, default: 0 },
  subscriberDetails: [
    {
      subscriberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber' },
      name: { type: String },
      deliveries: { type: Number },
      containers: { type: Number },
      returned: { type: Number },
      pending: { type: Number },
      value: { type: Number },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Ensure one report per date and type
ReportSchema.index({ type: 1, date: 1 }, { unique: true });

// module.exports = mongoose.model("Report", ReportSchema);

//   touch deliveryPersonnel.entity.ts delivery.entity.ts container.entity.ts report.entity.ts
//   touch subscriber.entity.ts deliveryPersonnel.entity.ts delivery.entity.ts container.entity.ts report.entity.ts
//

const Report = mongoose.model('Report', ReportSchema);

export default Report;
