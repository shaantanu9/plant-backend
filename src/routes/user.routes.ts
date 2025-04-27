import { NextFunction, Request, Response, Router } from 'express';
import { UserController } from '@controllers';
import BaseRoute from './base.routes';
import { validator } from '@middleware';
import { UserCreateSchema } from '../schemas/user.schema';

class UserRoute extends BaseRoute {
  public path: string;

  constructor(path: string) {
    super();
    this.path = path;
    this.init();
  }

  get instance(): Router {
    return this.router;
  }

  init() {
    // *** IMPORTANT: Specific routes must come before parameter routes to avoid conflicts ***

    // General queries
    // checkUserExists
    this.router.get(
      '/check-user-exists/:email',
      (req: Request, res: Response, next: NextFunction) => {
        UserController.checkUserExists(req, res, next);
      },
    );

    // Get all users
    this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
      UserController.findAllUsers(req, res, next);
    });

    // Search users
    this.router.get('/search', (req: Request, res: Response, next: NextFunction) => {
      UserController.searchUsers(req, res, next);
    });

    // Analytics and statistics

    // Get user analytics
    this.router.get('/analytics', (req: Request, res: Response, next: NextFunction) => {
      UserController.getUserAnalytics(req, res, next);
    });

    // Get user counts by role
    this.router.get('/counts/role', (req: Request, res: Response, next: NextFunction) => {
      UserController.countByRole(req, res, next);
    });

    // Get user counts by zone
    this.router.get('/counts/zone', (req: Request, res: Response, next: NextFunction) => {
      UserController.countByZone(req, res, next);
    });

    // Status-based queries

    // Get inactive users
    this.router.get('/inactive', (req: Request, res: Response, next: NextFunction) => {
      UserController.findInactiveUsers(req, res, next);
    });

    // Get users with unverified emails
    this.router.get('/unverified-emails', (req: Request, res: Response, next: NextFunction) => {
      UserController.findUnverifiedEmails(req, res, next);
    });

    // Get recently active users
    this.router.get('/recently-active', (req: Request, res: Response, next: NextFunction) => {
      UserController.findRecentlyActiveUsers(req, res, next);
    });

    // Authentication operations

    // Generate password reset token
    this.router.post('/generate-reset-token', (req: Request, res: Response, next: NextFunction) => {
      UserController.generateResetToken(req, res, next);
    });

    // Login user
    this.router.post('/login', (req: Request, res: Response, next: NextFunction) => {
      UserController.login(req, res, next);
    });

    // Reset password with token
    this.router.post('/reset-password', (req: Request, res: Response, next: NextFunction) => {
      UserController.resetPasswordWithToken(req, res, next);
    });

    // Find user by token
    this.router.get('/token/:token', (req: Request, res: Response, next: NextFunction) => {
      UserController.findByToken(req, res, next);
    });

    // logout
    this.router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
      UserController.logout(req, res, next);
    });

    // Role-based queries

    // Find users by role
    this.router.get('/role/:role', (req: Request, res: Response, next: NextFunction) => {
      UserController.findUsersByRole(req, res, next);
    });

    // Find active users by role
    this.router.get('/role/:role/active', (req: Request, res: Response, next: NextFunction) => {
      UserController.findActiveUsersByRole(req, res, next);
    });

    // Find users by role and zone
    this.router.get('/role/:role/zone/:zone', (req: Request, res: Response, next: NextFunction) => {
      UserController.findUsersByRoleAndZone(req, res, next);
    });

    // Zone-based queries

    // Find users by zone
    this.router.get('/zone/:zone', (req: Request, res: Response, next: NextFunction) => {
      UserController.findUsersByZone(req, res, next);
    });

    // Reference-based queries

    // Find by subscriber ID
    this.router.get(
      '/subscriber/:subscriberId',
      (req: Request, res: Response, next: NextFunction) => {
        UserController.findBySubscriberId(req, res, next);
      },
    );

    // Find by personnel ID
    this.router.get(
      '/personnel/:personnelId',
      (req: Request, res: Response, next: NextFunction) => {
        UserController.findByPersonnelId(req, res, next);
      },
    );

    // Find by email
    this.router.get('/email/:email', (req: Request, res: Response, next: NextFunction) => {
      UserController.findUserByEmail(req, res, next);
    });

    // Create a new user
    this.router.post(
      '/',
      validator(UserCreateSchema, 'body'),
      (req: Request, res: Response, next: NextFunction) => {
        console.log('INSIDE ROUTE AFTER VALIDATION', req.body);
        UserController.createUser(req, res, next);
      },
    );

    // User-specific operations

    // Get user by ID
    this.router.get('/:userId', (req: Request, res: Response, next: NextFunction) => {
      UserController.findUserById(req, res, next);
    });

    // Update user
    this.router.put('/:userId', (req: Request, res: Response, next: NextFunction) => {
      UserController.updateUser(req, res, next);
    });

    // Delete user
    this.router.delete('/:userId', (req: Request, res: Response, next: NextFunction) => {
      UserController.deleteUser(req, res, next);
    });

    // Verify password
    this.router.post(
      '/:userId/verify-password',
      (req: Request, res: Response, next: NextFunction) => {
        UserController.verifyPassword(req, res, next);
      },
    );

    // Update password
    this.router.put('/:userId/password', (req: Request, res: Response, next: NextFunction) => {
      UserController.updatePassword(req, res, next);
    });

    // Update last active timestamp
    this.router.put('/:userId/last-active', (req: Request, res: Response, next: NextFunction) => {
      UserController.updateLastActive(req, res, next);
    });

    // Token management

    // Add authentication token
    this.router.post('/:userId/tokens', (req: Request, res: Response, next: NextFunction) => {
      UserController.addToken(req, res, next);
    });

    // Remove authentication token
    this.router.delete('/:userId/tokens', (req: Request, res: Response, next: NextFunction) => {
      UserController.removeToken(req, res, next);
    });

    // Clear all tokens
    this.router.delete('/:userId/tokens/all', (req: Request, res: Response, next: NextFunction) => {
      UserController.clearTokens(req, res, next);
    });

    // Address and location

    // Update address
    this.router.put('/:userId/address', (req: Request, res: Response, next: NextFunction) => {
      UserController.updateAddress(req, res, next);
    });

    // Update zone
    this.router.put('/:userId/zone', (req: Request, res: Response, next: NextFunction) => {
      UserController.updateZone(req, res, next);
    });

    // Status management

    // Toggle active status
    this.router.put('/:userId/active', (req: Request, res: Response, next: NextFunction) => {
      UserController.toggleActiveStatus(req, res, next);
    });

    // Verify email
    this.router.put('/:userId/verify-email', (req: Request, res: Response, next: NextFunction) => {
      UserController.verifyEmail(req, res, next);
    });

    // Verify phone
    this.router.put('/:userId/verify-phone', (req: Request, res: Response, next: NextFunction) => {
      UserController.verifyPhone(req, res, next);
    });

    // Role-specific operations

    // Link to subscriber details
    this.router.put('/:userId/subscriber', (req: Request, res: Response, next: NextFunction) => {
      UserController.linkToSubscriberDetails(req, res, next);
    });

    // Link to personnel details
    this.router.put('/:userId/personnel', (req: Request, res: Response, next: NextFunction) => {
      UserController.linkToPersonnelDetails(req, res, next);
    });

    // Change role
    this.router.put('/:userId/role', (req: Request, res: Response, next: NextFunction) => {
      UserController.changeRole(req, res, next);
    });

    // Contact information

    // Update phone
    this.router.put('/:userId/phone', (req: Request, res: Response, next: NextFunction) => {
      UserController.updatePhone(req, res, next);
    });

    // Update alternate phone
    this.router.put(
      '/:userId/alternate-phone',
      (req: Request, res: Response, next: NextFunction) => {
        UserController.updateAlternatePhone(req, res, next);
      },
    );

    // Update emergency contact
    this.router.put(
      '/:userId/emergency-contact',
      (req: Request, res: Response, next: NextFunction) => {
        UserController.updateEmergencyContact(req, res, next);
      },
    );

    // Preferences

    // Update notification preferences
    this.router.put(
      '/:userId/preferences/notifications',
      (req: Request, res: Response, next: NextFunction) => {
        UserController.updateNotificationPreferences(req, res, next);
      },
    );

    // Update language
    this.router.put(
      '/:userId/preferences/language',
      (req: Request, res: Response, next: NextFunction) => {
        UserController.updateLanguage(req, res, next);
      },
    );

    // Update reminder time
    this.router.put(
      '/:userId/preferences/reminder-time',
      (req: Request, res: Response, next: NextFunction) => {
        UserController.updateReminderTime(req, res, next);
      },
    );

    // Device management

    // Update FCM token
    this.router.put('/:userId/fcm-token', (req: Request, res: Response, next: NextFunction) => {
      UserController.updateFCMToken(req, res, next);
    });

    // Update app version
    this.router.put('/:userId/app-version', (req: Request, res: Response, next: NextFunction) => {
      UserController.updateAppVersion(req, res, next);
    });

    // Update device info
    this.router.put('/:userId/device-info', (req: Request, res: Response, next: NextFunction) => {
      UserController.updateDeviceInfo(req, res, next);
    });

    // Complete onboarding
    this.router.put('/:userId/onboarding', (req: Request, res: Response, next: NextFunction) => {
      UserController.completeOnboarding(req, res, next);
    });
  }
}

export default new UserRoute('/users');
