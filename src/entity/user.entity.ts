import * as argon2 from 'argon2';
import { Model } from 'mongoose';
import UserModel from '@models/user.model';
import { toObjectId } from '@utils';
import BaseEntity from './base.entity';

class UserEntity extends BaseEntity {
  constructor(model: Model<any>) {
    super(model);
  }

  // *** Basic CRUD operations ***

  // Create a new user
  public async createUser(data: any) {
    return this.create(data);
  }

  // Find user by ID
  public async findUserById(userId: string) {
    return this.findOne({ _id: toObjectId(userId) });
  }

  // Find user by email
  public async findUserByEmail(email: string) {
    return this.findOne({ email });
  }

  // Find users by role
  public async findUsersByRole(role: string) {
    return this.find({ role });
  }

  // Update user profile by ID
  public async updateUser(userId: string, updates: any) {
    return this.updateOne({ _id: toObjectId(userId) }, updates);
  }

  // Delete user by ID
  public async deleteUser(userId: string) {
    return this.deleteOne({ _id: toObjectId(userId) });
  }

  // *** Authentication operations ***

  // Verify user password
  public async verifyPassword(userId: string, password: string) {
    const user: any = await this.findOne({ _id: toObjectId(userId) });
    let isValid = false;
    if (!user) return { isValid, user: null };
    isValid = await argon2.verify(user.password, password);
    return { isValid, user };
  }

  // Update user password
  public async updatePassword(userId: string, newPassword: string) {
    const user: any = await this.findOne({ _id: toObjectId(userId) });
    if (!user) return null;

    user.password = newPassword;
    return user.save();
  }

  // Generate password reset token
  public async generateResetToken(email: string) {
    const user: any = await this.findOne({ email });
    if (!user) return null;

    const resetToken = user.generatePasswordResetToken();
    await user.save();
    return resetToken;
  }

  // Reset password with token
  public async resetPasswordWithToken(token: string, newPassword: string) {
    const hashedToken = require('crypto').createHash('sha256').update(token).digest('hex');

    const user: any = await this.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return null;

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    return user.save();
  }

  // Increment login attempts
  public async incrementLoginAttempts(userId: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { $inc: { loginAttempts: 1 } });
  }

  // Lock account
  public async lockAccount(userId: string, durationInMinutes = 30) {
    return this.updateOne(
      { _id: toObjectId(userId) },
      { lockUntil: new Date(Date.now() + durationInMinutes * 60000) },
    );
  }

  // Unlock account
  public async unlockAccount(userId: string) {
    return this.updateOne(
      { _id: toObjectId(userId) },
      { $set: { loginAttempts: 0, lockUntil: null } },
    );
  }

  // *** Token management ***

  // Add authentication token
  public async addToken(userId: string, token: string, device: string) {
    return this.updateOne(
      { _id: toObjectId(userId) },
      {
        $push: {
          tokens: {
            token,
            device,
            createdAt: new Date(),
          },
        },
      },
    );
  }

  // Remove specific token
  public async removeToken(userId: string, token: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { $pull: { tokens: { token } } });
  }

  // Clear all tokens
  public async clearTokens(userId: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { tokens: [] } });
  }

  // Find user by token
  public async findByToken(token: string) {
    return this.findOne({ 'tokens.token': token });
  }

  // *** Address and location operations ***

  // Update address
  public async updateAddress(userId: string, addressData: any) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { address: addressData } });
  }

  // Update zone
  public async updateZone(userId: string, zone: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { zone } });
  }

  // Find users by zone
  public async findUsersByZone(zone: string) {
    return this.find({ zone });
  }

  // *** Status management ***

  // Toggle user active status
  public async toggleActiveStatus(userId: string, isActive: boolean) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { isActive } });
  }

  // Update last active timestamp
  public async updateLastActive(userId: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { lastLogin: new Date() });
  }

  // Verify email
  public async verifyEmail(userId: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { emailVerified: true } });
  }

  // Verify phone
  public async verifyPhone(userId: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { phoneVerified: true } });
  }

  // *** Role-specific operations ***

  // Link with subscriber details
  public async linkToSubscriberDetails(userId: string, subscriberId: string) {
    return this.updateOne(
      { _id: toObjectId(userId) },
      { $set: { subscriberDetails: toObjectId(subscriberId) } },
    );
  }

  // Link with delivery personnel details
  public async linkToPersonnelDetails(userId: string, personnelId: string) {
    return this.updateOne(
      { _id: toObjectId(userId) },
      { $set: { personnelDetails: toObjectId(personnelId) } },
    );
  }

  // Find user by subscriber ID
  public async findBySubscriberId(subscriberId: string) {
    return this.findOne({ subscriberDetails: toObjectId(subscriberId) });
  }

  // Find user by personnel ID
  public async findByPersonnelId(personnelId: string) {
    return this.findOne({ personnelDetails: toObjectId(personnelId) });
  }

  // Change user role
  public async changeRole(userId: string, newRole: string) {
    if (!['admin', 'delivery', 'subscriber'].includes(newRole)) {
      throw new Error('Invalid role');
    }

    return this.updateOne({ _id: toObjectId(userId) }, { $set: { role: newRole } });
  }

  // *** Contact information operations ***

  // Update phone
  public async updatePhone(userId: string, phone: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { phone, phoneVerified: false } });
  }

  // Update alternate phone
  public async updateAlternatePhone(userId: string, alternatePhone: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { alternatePhone } });
  }

  // Update emergency contact
  public async updateEmergencyContact(userId: string, emergencyContact: any) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { emergencyContact } });
  }

  // *** Preference operations ***

  // Update notification preferences
  public async updateNotificationPreferences(userId: string, preferences: any) {
    return this.updateOne(
      { _id: toObjectId(userId) },
      { $set: { 'preferences.notifications': preferences } },
    );
  }

  // Update language preference
  public async updateLanguage(userId: string, language: string) {
    return this.updateOne(
      { _id: toObjectId(userId) },
      { $set: { 'preferences.language': language } },
    );
  }

  // Update reminder time
  public async updateReminderTime(userId: string, reminderTime: string) {
    return this.updateOne(
      { _id: toObjectId(userId) },
      { $set: { 'preferences.reminderTime': reminderTime } },
    );
  }

  // *** Device management operations ***

  // Update FCM token
  public async updateFCMToken(userId: string, fcmToken: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { fcmToken } });
  }

  // Update app version
  public async updateAppVersion(userId: string, appVersion: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { appVersion } });
  }

  // Update device info
  public async updateDeviceInfo(userId: string, deviceInfo: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { deviceInfo } });
  }

  // Mark onboarding as completed
  public async completeOnboarding(userId: string) {
    return this.updateOne({ _id: toObjectId(userId) }, { $set: { onboardingCompleted: true } });
  }

  // *** Advanced queries ***

  // Find active users by role
  public async findActiveUsersByRole(role: string) {
    return this.find({ role, isActive: true });
  }

  // Find inactive users
  public async findInactiveUsers() {
    return this.find({ isActive: false });
  }

  // Find unverified emails
  public async findUnverifiedEmails() {
    return this.find({ emailVerified: false });
  }

  // Find users by role and zone
  public async findUsersByRoleAndZone(role: string, zone: string) {
    return this.find({ role, zone });
  }

  // Find users with recent activity
  public async findRecentlyActiveUsers(days: number = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.find({ lastLogin: { $gte: cutoff } });
  }

  // Search users
  public async searchUsers(query: string) {
    const searchRegex = new RegExp(query, 'i');

    return this.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { 'address.street': searchRegex },
        { 'address.city': searchRegex },
        { 'address.state': searchRegex },
        { 'address.zipCode': searchRegex },
        { zone: searchRegex },
      ],
    });
  }

  // Count users by role
  public async countByRole() {
    return UserModel.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
  }

  // Count users by zone
  public async countByZone() {
    return UserModel.aggregate([{ $group: { _id: '$zone', count: { $sum: 1 } } }]);
  }

  // Get user analytics
  public async getUserAnalytics() {
    return UserModel.aggregate([
      {
        $facet: {
          byRole: [{ $group: { _id: '$role', count: { $sum: 1 } } }],
          byZone: [{ $group: { _id: '$zone', count: { $sum: 1 } } }],
          byActiveStatus: [{ $group: { _id: '$isActive', count: { $sum: 1 } } }],
          total: [{ $count: 'count' }],
        },
      },
    ]);
  }

  // Login user
  public async login(email: string, password: string) {
    console.log('361login', email, password);
    const user: any = await this.findOne({ email });
    if (!user) return null;

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) return null;

    return user;
  }

  // findAllUsers
  public async findAllUsers() {
    return this.find({});
  }

  // checkUserExists
  public async checkUserExists(email: string | number) {
    console.log('380', email);
    // return this.findOne({ email });
    // email or phone
    const user = await this.findOne({ $or: [{ email }, { phone: email }] });
    console.log('382', { user });
    return user;
  }

  // logout
  public async logout(userId: string) {
    return this.updateOne(
      { _id: toObjectId(userId) },
      { $set: { isActive: false, logoutTime: new Date(), token: null } },
    );
  }
}

export const UserEntities = new UserEntity(UserModel);
