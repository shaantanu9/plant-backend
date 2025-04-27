import { NextFunction, Request, Response } from 'express';
import { UserEntities } from '@entity';
import { RESPONSE } from '@response';
import { Auth, toObjectId } from '@services';
import BaseController from './base.controller';
import * as argon2 from 'argon2';

class UserControllerClass extends BaseController {
  constructor() {
    super();
  }

  // *** Basic CRUD operations ***

  // Create a new user
  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserEntities.createUser(req.body);
      return this.sendResponse(
        res,
        user,
        RESPONSE.USER('User created successfully'),
        // .USER_CREATED
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Find user by ID
  public async findUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await UserEntities.findUserById(userId);

      return user
        ? this.sendResponse(res, user, RESPONSE.USER('User found'))
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Find user by email
  public async findUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const user = await UserEntities.findUserByEmail(email);

      return user
        ? this.sendResponse(res, user, RESPONSE.USER('User found').EMAIL_RETRIEVED)
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Find users by role
  public async findUsersByRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req.params;
      const users = await UserEntities.findUsersByRole(role);

      return this.sendResponse(res, users, RESPONSE.USER('Users found'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update user profile
  public async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const updates = req.body;
      const result = await UserEntities.updateUser(userId, updates);

      return result.modifiedCount > 0
        ? this.sendResponse(res, { updated: true }, RESPONSE.USER('User updated successfully'))
        : this.notFound(res, 'User not found or no changes made');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Delete user
  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const result = await UserEntities.deleteUser(userId);

      return result.success
        ? this.sendResponse(res, { deleted: true }, RESPONSE.USER('User deleted successfully'))
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Authentication operations ***

  // Verify user password
  public async verifyPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { password } = req.body;

      if (!password) {
        return this.badRequest(res, 'Password is required');
      }
      console.log({ userId, password }, 'userId, password 128');

      const { isValid, user } = await UserEntities.verifyPassword(userId, password);

      const { password: userPassword, ...rest } = user;
      const token = Auth.generateToken(rest);

      return this.sendResponse(
        res,
        { isValid, token },

        RESPONSE.USER('Password verification completed').LOGIN_SUCCESS,
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update password
  public async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return this.badRequest(res, 'Current password and new password are required');
      }

      // Verify current password first
      const isValid = await UserEntities.verifyPassword(userId, currentPassword);
      if (!isValid) {
        return this.unauthorized(res, 'Current password is incorrect');
      }

      const user = await UserEntities.updatePassword(userId, newPassword);

      return user
        ? this.sendResponse(res, { updated: true }, RESPONSE.USER('Password updated successfully'))
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Generate password reset token
  public async generateResetToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      if (!email) {
        return this.badRequest(res, 'Email is required');
      }

      const resetToken = await UserEntities.generateResetToken(email);

      return resetToken
        ? this.sendResponse(res, { resetToken }, RESPONSE.USER('Reset token generated'))
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Reset password with token
  public async resetPasswordWithToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return this.badRequest(res, 'Token and new password are required');
      }

      const user = await UserEntities.resetPasswordWithToken(token, newPassword);

      return user
        ? this.sendResponse(res, { reset: true }, RESPONSE.USER('Password reset successful'))
        : this.badRequest(res, 'Invalid or expired token');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update last login
  public async updateLastActive(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const result = await UserEntities.updateLastActive(userId);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.USER('Last active time updated successfully'),
            // .LAST_ACTIVE
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Token management ***

  // Add authentication token
  public async addToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { token, device } = req.body;

      if (!token || !device) {
        return this.badRequest(res, 'Token and device are required');
      }

      const result = await UserEntities.addToken(userId, token, device);

      return result.modifiedCount > 0
        ? this.sendResponse(res, { added: true }, RESPONSE.USER('Token added successfully'))
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Remove authentication token
  public async removeToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { token } = req.body;

      if (!token) {
        return this.badRequest(res, 'Token is required');
      }

      const result = await UserEntities.removeToken(userId, token);

      return result.modifiedCount > 0
        ? this.sendResponse(res, { removed: true }, RESPONSE.USER('Token removed successfully'))
        : this.notFound(res, "User not found or token doesn't exist");
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Clear all tokens
  public async clearTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const result = await UserEntities.clearTokens(userId);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { cleared: true },
            RESPONSE.USER('All tokens cleared successfully'),
            // .TOKENS_CLEARED
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Find user by token
  public async findByToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const user = await UserEntities.findByToken(token);

      return user
        ? this.sendResponse(
            res,
            user,
            RESPONSE.USER('User found'),
            // .USERS_FOUND
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Address and location operations ***

  // Update address
  public async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const addressData = req.body;

      const result = await UserEntities.updateAddress(userId, addressData);

      return result.modifiedCount > 0
        ? this.sendResponse(res, { updated: true }, RESPONSE.USER('Address updated successfully'))
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update zone
  public async updateZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { zone } = req.body;

      if (!zone) {
        return this.badRequest(res, 'Zone is required');
      }

      const result = await UserEntities.updateZone(userId, zone);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.USER('Zone updated successfully'),
            // .ZONE_UPDATED
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Find users by zone
  public async findUsersByZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { zone } = req.params;
      const users = await UserEntities.findUsersByZone(zone);

      return this.sendResponse(res, users, RESPONSE.USER('Users found'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Status management ***

  // Toggle active status
  public async toggleActiveStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return this.badRequest(res, 'isActive must be a boolean value');
      }

      const result = await UserEntities.toggleActiveStatus(userId, isActive);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.USER(`User ${isActive ? 'activated' : 'deactivated'} successfully`),
            // .USER_ACTIVE_STATUS_UPDATED
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Verify email
  public async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const result = await UserEntities.verifyEmail(userId);

      return result.modifiedCount > 0
        ? this.sendResponse(res, { verified: true }, RESPONSE.USER('Email verified successfully'))
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Verify phone
  public async verifyPhone(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const result = await UserEntities.verifyPhone(userId);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { verified: true },
            RESPONSE.USER('Phone verified successfully').PHONE_VERIFIED,
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Role-specific operations ***

  // Link to subscriber details
  public async linkToSubscriberDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { subscriberId } = req.body;

      if (!subscriberId) {
        return this.badRequest(res, 'Subscriber ID is required');
      }

      const result = await UserEntities.linkToSubscriberDetails(userId, subscriberId);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { linked: true },
            RESPONSE.USER('User linked to subscriber details').USER_LINKED,
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Link to personnel details
  public async linkToPersonnelDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { personnelId } = req.body;

      if (!personnelId) {
        return this.badRequest(res, 'Personnel ID is required');
      }

      const result = await UserEntities.linkToPersonnelDetails(userId, personnelId);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { linked: true },
            RESPONSE.USER('User linked to personnel details'),
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Find by subscriber ID
  public async findBySubscriberId(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const user = await UserEntities.findBySubscriberId(subscriberId);

      return user
        ? this.sendResponse(res, user, RESPONSE.USER('User found'))
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Find by personnel ID
  public async findByPersonnelId(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const user = await UserEntities.findByPersonnelId(personnelId);

      return user
        ? this.sendResponse(res, user, RESPONSE.USER('User found'))
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Change role
  public async changeRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!role || !['admin', 'delivery', 'subscriber'].includes(role)) {
        return this.badRequest(res, 'Valid role is required (admin, delivery, or subscriber)');
      }

      const result = await UserEntities.changeRole(userId, role);

      return result.modifiedCount > 0
        ? this.sendResponse(res, { updated: true }, RESPONSE.USER('User role updated successfully'))
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Contact information operations ***

  // Update phone
  public async updatePhone(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { phone } = req.body;

      if (!phone || !/^[0-9]{10}$/.test(phone)) {
        return this.badRequest(res, 'Valid 10-digit phone number is required');
      }

      const result = await UserEntities.updatePhone(userId, phone);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.USER('Phone number updated successfully'),
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update alternate phone
  public async updateAlternatePhone(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { alternatePhone } = req.body;

      if (alternatePhone && !/^[0-9]{10}$/.test(alternatePhone)) {
        return this.badRequest(res, 'Alternate phone must be a valid 10-digit number');
      }

      const result = await UserEntities.updateAlternatePhone(userId, alternatePhone);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.USER('Alternate phone number updated successfully'),
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update emergency contact
  public async updateEmergencyContact(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const emergencyContact = req.body;

      if (!emergencyContact.name || !emergencyContact.phone || !emergencyContact.relationship) {
        return this.badRequest(res, 'Emergency contact must include name, phone, and relationship');
      }

      const result = await UserEntities.updateEmergencyContact(userId, emergencyContact);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.USER('Emergency contact updated successfully'),
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Preference operations ***

  // Update notification preferences
  public async updateNotificationPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const preferences = req.body;

      const result = await UserEntities.updateNotificationPreferences(userId, preferences);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.USER('Notification preferences updated successfully'),
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update language preference
  public async updateLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { language } = req.body;

      if (!language) {
        return this.badRequest(res, 'Language code is required');
      }

      const result = await UserEntities.updateLanguage(userId, language);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.USER('Language preference updated successfully'),
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update reminder time
  public async updateReminderTime(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { reminderTime } = req.body;

      if (!reminderTime) {
        return this.badRequest(res, 'Reminder time is required');
      }

      const result = await UserEntities.updateReminderTime(userId, reminderTime);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.USER('Reminder time updated successfully'),
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Device management operations ***

  // Update FCM token
  public async updateFCMToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { fcmToken } = req.body;

      if (!fcmToken) {
        return this.badRequest(res, 'FCM token is required');
      }

      const result = await UserEntities.updateFCMToken(userId, fcmToken);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.USER('FCM token updated successfully').FCM_TOKEN_UPDATED,
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update app version
  public async updateAppVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { appVersion } = req.body;

      if (!appVersion) {
        return this.badRequest(res, 'App version is required');
      }

      const result = await UserEntities.updateAppVersion(userId, appVersion);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.USER('App version updated successfully').APP_VERSION_UPDATED,
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update device info
  public async updateDeviceInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { deviceInfo } = req.body;

      if (!deviceInfo) {
        return this.badRequest(res, 'Device info is required');
      }

      const result = await UserEntities.updateDeviceInfo(userId, deviceInfo);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.USER('Device info updated successfully').DEVICE_INFO_UPDATED,
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Complete onboarding
  public async completeOnboarding(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const result = await UserEntities.completeOnboarding(userId);

      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { completed: true },
            RESPONSE.USER('Onboarding marked as completed').ONBOARDING_COMPLETED,
          )
        : this.notFound(res, 'User not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Advanced queries ***

  // Find active users by role
  public async findActiveUsersByRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req.params;
      const users = await UserEntities.findActiveUsersByRole(role);

      return this.sendResponse(
        res,
        users,
        RESPONSE.USER('Active users found').ACTIVE_USERS_BY_ROLE_RETRIEVED,
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Find inactive users
  public async findInactiveUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserEntities.findInactiveUsers();

      return this.sendResponse(
        res,
        users,
        RESPONSE.USER('Inactive users found').INACTIVE_USERS_FOUND,
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Find users with unverified emails
  public async findUnverifiedEmails(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserEntities.findUnverifiedEmails();

      return this.sendResponse(
        res,
        users,
        RESPONSE.USER('Users with unverified emails found').USERS_FOUND,
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Find users by role and zone
  public async findUsersByRoleAndZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { role, zone } = req.params;
      const users = await UserEntities.findUsersByRoleAndZone(role, zone);

      return this.sendResponse(
        res,
        users,
        RESPONSE.USER('Users found').ACTIVE_USERS_BY_ROLE_RETRIEVED,
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Find recently active users
  public async findRecentlyActiveUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { days } = req.query;
      const daysNumber = days ? parseInt(days as string) : 7;

      if (isNaN(daysNumber) || daysNumber <= 0) {
        return this.badRequest(res, 'Days must be a positive number');
      }

      const users = await UserEntities.findRecentlyActiveUsers(daysNumber);

      return this.sendResponse(
        res,
        users,
        RESPONSE.USER('Recently active users found').USERS_FOUND,
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Search users
  public async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.query;

      if (!query) {
        return this.badRequest(res, 'Search query is required');
      }

      const users = await UserEntities.searchUsers(query as string);

      return this.sendResponse(res, users, RESPONSE.USER('Search results').USERS_FOUND);
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get user counts by role
  public async countByRole(req: Request, res: Response, next: NextFunction) {
    try {
      const counts = await UserEntities.countByRole();

      return this.sendResponse(
        res,
        counts,
        RESPONSE.USER('User counts by role'),
        // .COUNTS_RETRIEVED
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get user counts by zone
  public async countByZone(req: Request, res: Response, next: NextFunction) {
    try {
      const counts = await UserEntities.countByZone();

      return this.sendResponse(
        res,
        counts,
        RESPONSE.USER('User counts by zone'),
        // .COUNTS_RETRIEVED
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get user analytics
  public async getUserAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await UserEntities.getUserAnalytics();

      return this.sendResponse(res, analytics[0], RESPONSE.USER('').ANALYTICS_RETRIEVED);
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // login
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('889 login', req.body);
      const { email, password } = req.body;
      const user = await UserEntities.login(email, password);

      if (!user) {
        return this.unauthorized(res, 'Invalid email or password');
      }

      const smallTokenString = await argon2.hash(user._id);
      const tokenData = {
        isLoggedIn: true,
        name: user.name,
        email: user.email,
        role: user.role,
        zone: user.zone,
        _id: user._id,
      };
      const token = Auth.generateToken(tokenData);
      await UserEntities.updateOne(
        { _id: toObjectId(user._id) },
        { $set: { isLoggedIn: true, token: smallTokenString, logoutTime: null } },
      );

      return this.sendResponse(res, { token, user }, RESPONSE.USER('').LOGIN_SUCCESS);
    } catch (error) {
      return this.sendError(res, error);
    }
  }
  // findAllUsers
  public async findAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      console.log({ user }, 'user 1092 user.controller.ts');
      const users = await UserEntities.findAllUsers();

      return this.sendResponse(res, users, RESPONSE.USER('Users found'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // checkUserExists
  public async checkUserExists(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const user = await UserEntities.checkUserExists(email);
      return this.sendResponse(res, user, RESPONSE.USER('User found'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // logout
  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await UserEntities.logout(userId);
      return this.sendResponse(res, user, RESPONSE.USER('User logged out'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }
}

export const UserController = new UserControllerClass();
