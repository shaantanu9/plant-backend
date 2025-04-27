// /**
//  * The above functions handle subscription management tasks such as processing renewals, notifying
//  * expiring subscriptions, and pausing subscriptions for a subscriber.
//  * @returns The `processSubscriptionRenewals` function returns an object with the following properties:
//  * - `processed`: Number of subscriptions successfully processed for renewal
//  * - `failed`: Number of subscriptions that failed during processing
//  * - `notifications`: Number of confirmation emails sent
//  */
// import Subscription from '../models/subscription.model';
// import Subscriber from '../models/subscriber.model';
// import mongoose from 'mongoose';

// /**
//  * Process subscription renewals and billing
//  * This can be run as a scheduled job (e.g., daily)
//  */
// export const processSubscriptionRenewals = async () => {
//   try {
//     // Get all subscriptions due for billing today
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const dueSubscriptions = await Subscription.find({
//       status: 'active',
//       nextBillingDate: { $gte: today, $lt: tomorrow }
//     }).populate('subscriberId', 'name email');

//     console.log(`Processing ${dueSubscriptions.length} subscriptions for renewal`);

//     const results = {
//       processed: 0,
//       failed: 0,
//       notifications: 0
//     };

//     // Process each subscription
//     for (const subscription of dueSubscriptions) {
//       try {
//         // Here you would integrate with your payment gateway
//         // For now, we'll just update the billing date and create a payment record

//         // Calculate next billing date
//         const nextBillingDate = calculateNextBillingDate(
//           subscription.nextBillingDate,
//           subscription.billingCycle
//         );

//         // Record payment (in a real system this would happen after payment processing)
//         await Subscription.findByIdAndUpdate(
//           subscription._id,
//           {
//             $set: { nextBillingDate },
//             $push: {
//               paymentHistory: {
//                 amount: subscription.quantity * subscription.pricePerUnit,
//                 date: new Date(),
//                 status: 'completed',
//                 transactionId: `AUTO-${Date.now()}`
//               }
//             }
//           }
//         );

//         // Send confirmation email
//         if (subscription.subscriberId?.email) {
//           await sendEmail({
//             to: subscription.subscriberId.email,
//             subject: 'Subscription Renewed',
//             text: `Your subscription for ${subscription.quantity} ${subscription.unitName || 'items'} has been renewed. The next billing date is ${nextBillingDate.toLocaleDateString()}.`
//           });
//           results.notifications++;
//         }

//         results.processed++;
//       } catch (error) {
//         console.error(`Error processing subscription ${subscription._id}:`, error);
//         results.failed++;
//       }
//     }

//     return results;
//   } catch (error) {
//     console.error('Error in subscription renewal job:', error);
//     throw error;
//   }
// };

// /**
//  * Check for subscriptions nearing end date and notify subscribers
//  * This can be run as a scheduled job (e.g., weekly)
//  */
// export const notifyExpiringSubscriptions = async () => {
//   try {
//     // Get subscriptions ending in the next 7 days
//     const today = new Date();
//     const nextWeek = new Date(today);
//     nextWeek.setDate(nextWeek.getDate() + 7);

//     const expiringSubscriptions = await Subscription.find({
//       status: 'active',
//       endDate: { $gte: today, $lte: nextWeek }
//     }).populate('subscriberId', 'name email');

//     console.log(`Found ${expiringSubscriptions.length} expiring subscriptions`);

//     let notified = 0;

//     // Send notifications
//     for (const subscription of expiringSubscriptions) {
//       try {
//         if (subscription.subscriberId?.email) {
//           await sendEmail({
//             to: subscription.subscriberId.email,
//             subject: 'Your Subscription is Ending Soon',
//             text: `Your subscription for ${subscription.quantity} ${subscription.unitName || 'items'} is set to expire on ${subscription.endDate.toLocaleDateString()}. Login to your account to renew.`
//           });
//           notified++;
//         }
//       } catch (error) {
//         console.error(`Error notifying for subscription ${subscription._id}:`, error);
//       }
//     }

//     return { total: expiringSubscriptions.length, notified };
//   } catch (error) {
//     console.error('Error in expiring subscriptions job:', error);
//     throw error;
//   }
// };

// /**
//  * Pause all subscriptions for a subscriber
//  * Useful for vacation mode or temporary pause
//  */
// export const pauseAllSubscriptionsForSubscriber = async (subscriberId: string, reason: string, endDate?: Date) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Find all active subscriptions for this subscriber
//     const subscriptions = await Subscription.find({
//       subscriberId,
//       status: 'active'
//     }).session(session);

//     console.log(`Pausing ${subscriptions.length} subscriptions for subscriber ${subscriberId}`);

//     // Update each subscription
//     for (const subscription of subscriptions) {
//       await Subscription.findByIdAndUpdate(
//         subscription._id,
//         {
//           $set: {
//             status: 'paused',
//             updatedAt: new Date()
//           },
//           $push: {
//             pauseHistory: {
//               startDate: new Date(),
//               endDate,
//               reason
//             }
//           }
//         },
//         { session }
//       );
//     }

//     // Update subscriber status if needed
//     if (subscriptions.length > 0) {
//       await Subscriber.findByIdAndUpdate(
//         subscriberId,
//         { $set: { hasActivePause: true } },
//         { session }
//       );
//     }

//     await session.commitTransaction();
//     session.endSession();

//     return { paused: subscriptions.length };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };
