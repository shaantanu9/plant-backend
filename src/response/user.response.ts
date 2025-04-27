// import HTTP from "./code.response";

// export default (lang: string) => ({
//   // General user operations
//   USER_CREATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User created successfully",
//   },
//   USER_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User updated successfully",
//   },
//   USER_DELETED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User deleted successfully",
//   },
//   USER_FOUND: {
//     httpCode: HTTP.SUCCESS,
//     message: "User found successfully",
//   },
//   USERS_FOUND: {
//     httpCode: HTTP.SUCCESS,
//     message: "Users found successfully",
//   },
//   USER_NOT_FOUND: {
//     httpCode: HTTP.NOT_FOUND,
//     message: "User not found",
//   },

//   // Authentication responses
//   LOGIN_SUCCESS: {
//     httpCode: HTTP.SUCCESS,
//     message: "User login successful",
//   },
//   LOGIN_ERROR: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Login error: Invalid credentials",
//   },
//   PASSWORD_VERIFIED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Password verification successful",
//   },
//   PASSWORD_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Password updated successfully",
//   },
//   PASSWORD_RESET: {
//     httpCode: HTTP.SUCCESS,
//     message: "Password reset successfully",
//   },
//   PASSWORD_RESET_ERROR: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Password reset error",
//   },
//   PASSWORD_MISMATCH: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Invalid password",
//   },

//   // Email and verification
//   EMAIL_VERIFIED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Email verified successfully",
//   },
//   EMAIL_ALREADY_VERIFIED: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Email already verified",
//   },
//   EMAIL_NOT_VERIFIED: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Email not verified",
//   },
//   EMAIL_RETRIEVED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Email retrieved successfully",
//   },
//   EMAIL_NOT_FOUND: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Email not found",
//   },
//   EMAIL_ALREADY_EXISTS: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Email already exists",
//   },
//   SEND_EMAIL_SUCCESS: {
//     httpCode: HTTP.SUCCESS,
//     message: "Email sent successfully",
//   },
//   SEND_EMAIL_ERROR: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Failed to send email",
//   },

//   // Phone verification
//   PHONE_VERIFIED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Phone verified successfully",
//   },
//   PHONE_ALREADY_EXISTS: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Phone number already exists",
//   },
//   PHONE_NOT_FOUND: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Phone number not found",
//   },
//   PHONE_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Phone number updated successfully",
//   },
//   ALT_PHONE_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Alternate phone number updated successfully",
//   },

//   // Activity and status
//   LAST_ACTIVE: {
//     httpCode: HTTP.SUCCESS,
//     message: "User last active time updated successfully",
//   },
//   USER_ACTIVE_STATUS_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User active status updated successfully",
//   },

//   // Token operations
//   TOKEN_ADDED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Token added successfully",
//   },
//   TOKEN_REMOVED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Token removed successfully",
//   },
//   TOKENS_CLEARED: {
//     httpCode: HTTP.SUCCESS,
//     message: "All tokens cleared successfully",
//   },
//   TOKEN_NOT_FOUND: {
//     httpCode: HTTP.NOT_FOUND,
//     message: "Token not found",
//   },
//   TOKEN_INVALID: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Invalid token",
//   },

//   // Address and location
//   ADDRESS_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Address updated successfully",
//   },
//   ZONE_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Zone updated successfully",
//   },

//   // Role operations
//   ROLE_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User role updated successfully",
//   },
//   SUBSCRIBER_LINKED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User linked to subscriber successfully",
//   },
//   PERSONNEL_LINKED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User linked to personnel successfully",
//   },

//   // Emergency contact
//   EMERGENCY_CONTACT_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Emergency contact updated successfully",
//   },

//   // Preferences
//   NOTIFICATION_PREFERENCES_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Notification preferences updated successfully",
//   },
//   LANGUAGE_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Language preference updated successfully",
//   },
//   REMINDER_TIME_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Reminder time updated successfully",
//   },

//   // Device information
//   FCM_TOKEN_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "FCM token updated successfully",
//   },
//   APP_VERSION_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "App version updated successfully",
//   },
//   DEVICE_INFO_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Device information updated successfully",
//   },

//   // Onboarding
//   ONBOARDING_COMPLETED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User onboarding completed successfully",
//   },

//   // Analytics
//   ANALYTICS_RETRIEVED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User analytics retrieved successfully",
//   },

//   // OTP
//   OTP_SENT: {
//     httpCode: HTTP.SUCCESS,
//     message: "OTP sent successfully",
//   },
//   OTP_MISMATCH: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "OTP mismatch",
//   },
//   OTP_RESEND: {
//     httpCode: HTTP.SUCCESS,
//     message: "New OTP sent to your email address",
//   },

//   // Misc existing responses
//   USER_ALREADY_SIGNUP: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Already signed up with us. Please login to continue",
//   },
//   CAPTCHA_FAILED: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "Captcha verification failed",
//   },
//   SIGNUP_USER_NOT_FOUND: {
//     httpCode: HTTP.NOT_FOUND,
//     message: "You are not signed up yet. Please sign up and try again.",
//   },

//   // Additional helpful responses
//   USER_FAVORITES_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User favorites updated successfully",
//   },
//   USER_PREFERENCE_UPDATED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User preference updated successfully",
//   },
//   PASSWORD_CHANGED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Password changed successfully",
//   },
//   MATCH_ADDED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Match added successfully",
//   },
//   MATCHES_FOUND: {
//     httpCode: HTTP.SUCCESS,
//     message: "Matches found successfully",
//   },
//   MATCH_HISTORY_FOUND: {
//     httpCode: HTTP.SUCCESS,
//     message: "Match history found successfully",
//   },
//   USER_UPDATED_LAST_ACTIVE: {
//     httpCode: HTTP.SUCCESS,
//     message: "User updated last active successfully",
//   },
//   USER_VERIFIED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User verified successfully",
//   },
//   USER_LINKED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User linked successfully",
//   },
//   USER_UNLINKED: {
//     httpCode: HTTP.SUCCESS,
//     message: "User unlinked successfully",
//   },
//   USER_DELETED_ALL: {
//     httpCode: HTTP.SUCCESS,
//     message: "User deleted all successfully",
//   },
//   USER_DELETED_ONE: {
//     httpCode: HTTP.SUCCESS,
//     message: "User deleted one successfully",
//   },
//   USER_DELETED_MANY: {
//     httpCode: HTTP.SUCCESS,
//     message: "User deleted many successfully",
//   },
//   USER_DELETED_ALL_FAILED: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "User deleted all failed",
//   },
//   USER_DELETED_ONE_FAILED: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "User deleted one failed",
//   },
//   USER_DELETED_MANY_FAILED: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "User deleted many failed",
//   },
//   USER_UPDATED_ONE: {
//     httpCode: HTTP.SUCCESS,
//     message: "User updated one successfully",
//   },
//   USER_UPDATED_MANY: {
//     httpCode: HTTP.SUCCESS,
//     message: "User updated many successfully",
//   },
//   USER_UPDATED_ONE_FAILED: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "User updated one failed",
//   },
//   USER_UPDATED_MANY_FAILED: {
//     httpCode: HTTP.BAD_REQUEST,
//     message: "User updated many failed",
//   },
//   USER_FOUND_ONE: {
//     httpCode: HTTP.SUCCESS,
//     message: "User found one successfully",
//   },
//   USER_FOUND_MANY: {
//     httpCode: HTTP.SUCCESS,
//     message: "User found many successfully",
//   },
//   COUNTS_RETRIEVED: {
//     httpCode: HTTP.SUCCESS,
//     message: "Counts retrieved successfully",
//   },
//   USER_NOT_FOUND_ONE: {
//     httpCode: HTTP.NOT_FOUND,
//     message: "User not found one",
//   },
// });

import HTTP from './code.response';

export default (lang: string) => {
  console.log('lang from Cooding-Soyar-Backend/src/response/user.response.ts', lang);
  if (lang.split(' ').length > 1) {
    console.log('INSIDE IF');
    return {
      httpCode: HTTP.SUCCESS,
      message: lang,
    };
  }

  return {
    // General user operations
    USER_CREATED: {
      httpCode: HTTP.SUCCESS,
      message: 'User created successfully',
    },
    USER_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'User updated successfully',
    },
    USER_DELETED: {
      httpCode: HTTP.SUCCESS,
      message: 'User deleted successfully',
    },
    USER_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'User found successfully',
    },
    USERS_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Users found successfully',
    },
    USER_NOT_FOUND: {
      httpCode: HTTP.NOT_FOUND,
      message: 'User not found',
    },

    // Authentication responses
    LOGIN_SUCCESS: {
      httpCode: HTTP.SUCCESS,
      message: 'User login successful',
    },
    LOGIN_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Login error: Invalid credentials',
    },
    PASSWORD_VERIFIED: {
      httpCode: HTTP.SUCCESS,
      message: 'Password verification successful',
    },
    PASSWORD_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Password updated successfully',
    },
    PASSWORD_RESET: {
      httpCode: HTTP.SUCCESS,
      message: 'Password reset successfully',
    },
    PASSWORD_RESET_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Password reset error',
    },
    PASSWORD_MISMATCH: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid password',
    },

    // Email and verification
    EMAIL_VERIFIED: {
      httpCode: HTTP.SUCCESS,
      message: 'Email verified successfully',
    },
    EMAIL_ALREADY_VERIFIED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Email already verified',
    },
    EMAIL_NOT_VERIFIED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Email not verified',
    },
    EMAIL_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Email retrieved successfully',
    },
    EMAIL_NOT_FOUND: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Email not found',
    },
    EMAIL_ALREADY_EXISTS: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Email already exists',
    },
    SEND_EMAIL_SUCCESS: {
      httpCode: HTTP.SUCCESS,
      message: 'Email sent successfully',
    },
    SEND_EMAIL_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Failed to send email',
    },

    // Phone verification
    PHONE_VERIFIED: {
      httpCode: HTTP.SUCCESS,
      message: 'Phone verified successfully',
    },
    PHONE_ALREADY_EXISTS: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Phone number already exists',
    },
    PHONE_NOT_FOUND: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Phone number not found',
    },
    PHONE_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Phone number updated successfully',
    },
    ALT_PHONE_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Alternate phone number updated successfully',
    },

    // Activity and status
    LAST_ACTIVE: {
      httpCode: HTTP.SUCCESS,
      message: 'User last active time updated successfully',
    },
    USER_ACTIVE_STATUS_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'User active status updated successfully',
    },

    // Token operations
    TOKEN_ADDED: {
      httpCode: HTTP.SUCCESS,
      message: 'Token added successfully',
    },
    TOKEN_REMOVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Token removed successfully',
    },
    TOKENS_CLEARED: {
      httpCode: HTTP.SUCCESS,
      message: 'All tokens cleared successfully',
    },
    TOKEN_NOT_FOUND: {
      httpCode: HTTP.NOT_FOUND,
      message: 'Token not found',
    },
    TOKEN_INVALID: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid token',
    },

    // Address and location
    ADDRESS_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Address updated successfully',
    },
    ZONE_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Zone updated successfully',
    },

    // Role operations
    ROLE_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'User role updated successfully',
    },
    SUBSCRIBER_LINKED: {
      httpCode: HTTP.SUCCESS,
      message: 'User linked to subscriber successfully',
    },
    PERSONNEL_LINKED: {
      httpCode: HTTP.SUCCESS,
      message: 'User linked to personnel successfully',
    },

    // Emergency contact
    EMERGENCY_CONTACT_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Emergency contact updated successfully',
    },

    // Preferences
    NOTIFICATION_PREFERENCES_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Notification preferences updated successfully',
    },
    LANGUAGE_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Language preference updated successfully',
    },
    REMINDER_TIME_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Reminder time updated successfully',
    },

    // Device information
    FCM_TOKEN_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'FCM token updated successfully',
    },
    APP_VERSION_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'App version updated successfully',
    },
    DEVICE_INFO_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Device information updated successfully',
    },

    // Onboarding
    ONBOARDING_COMPLETED: {
      httpCode: HTTP.SUCCESS,
      message: 'User onboarding completed successfully',
    },

    // Analytics
    ANALYTICS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'User analytics retrieved successfully',
    },
    COUNTS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'User counts retrieved successfully',
    },

    // OTP
    OTP_SENT: {
      httpCode: HTTP.SUCCESS,
      message: 'OTP sent successfully',
    },
    OTP_MISMATCH: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'OTP mismatch',
    },
    OTP_RESEND: {
      httpCode: HTTP.SUCCESS,
      message: 'New OTP sent to your email address',
    },

    // Misc existing responses
    USER_ALREADY_SIGNUP: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Already signed up with us. Please login to continue',
    },
    CAPTCHA_FAILED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Captcha verification failed',
    },
    SIGNUP_USER_NOT_FOUND: {
      httpCode: HTTP.NOT_FOUND,
      message: 'You are not signed up yet. Please sign up and try again.',
    },

    // Additional helpful responses
    USER_FAVORITES_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'User favorites updated successfully',
    },
    USER_PREFERENCE_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'User preference updated successfully',
    },
    PASSWORD_CHANGED: {
      httpCode: HTTP.SUCCESS,
      message: 'Password changed successfully',
    },
    MATCH_ADDED: {
      httpCode: HTTP.SUCCESS,
      message: 'Match added successfully',
    },
    MATCHES_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Matches found successfully',
    },
    MATCH_HISTORY_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Match history found successfully',
    },
    USER_UPDATED_LAST_ACTIVE: {
      httpCode: HTTP.SUCCESS,
      message: 'User updated last active successfully',
    },
    USER_VERIFIED: {
      httpCode: HTTP.SUCCESS,
      message: 'User verified successfully',
    },
    USER_LINKED: {
      httpCode: HTTP.SUCCESS,
      message: 'User linked successfully',
    },
    USER_UNLINKED: {
      httpCode: HTTP.SUCCESS,
      message: 'User unlinked successfully',
    },

    // Bulk operations and management responses
    USER_DELETED_ALL: {
      httpCode: HTTP.SUCCESS,
      message: 'User deleted all successfully',
    },
    USER_DELETED_ONE: {
      httpCode: HTTP.SUCCESS,
      message: 'User deleted one successfully',
    },
    USER_DELETED_MANY: {
      httpCode: HTTP.SUCCESS,
      message: 'User deleted many successfully',
    },
    USER_DELETED_ALL_FAILED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'User deleted all failed',
    },
    USER_DELETED_ONE_FAILED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'User deleted one failed',
    },
    USER_DELETED_MANY_FAILED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'User deleted many failed',
    },
    USER_UPDATED_ONE: {
      httpCode: HTTP.SUCCESS,
      message: 'User updated one successfully',
    },
    USER_UPDATED_MANY: {
      httpCode: HTTP.SUCCESS,
      message: 'User updated many successfully',
    },
    USER_UPDATED_ONE_FAILED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'User updated one failed',
    },
    USER_UPDATED_MANY_FAILED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'User updated many failed',
    },
    USER_FOUND_ONE: {
      httpCode: HTTP.SUCCESS,
      message: 'User found one successfully',
    },
    USER_FOUND_MANY: {
      httpCode: HTTP.SUCCESS,
      message: 'User found many successfully',
    },

    // Search and filter responses
    SEARCH_RESULTS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Search results retrieved successfully',
    },
    ACTIVE_USERS_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Active users found successfully',
    },
    INACTIVE_USERS_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Inactive users found successfully',
    },
    UNVERIFIED_EMAILS_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Users with unverified emails found successfully',
    },
    RECENTLY_ACTIVE_USERS_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Recently active users found successfully',
    },

    // Zone related responses
    USERS_BY_ZONE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Users by zone retrieved successfully',
    },
    USERS_BY_ROLE_AND_ZONE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Users by role and zone retrieved successfully',
    },
    ZONE_COUNTS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'User counts by zone retrieved successfully',
    },

    // Role related responses
    USERS_BY_ROLE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Users by role retrieved successfully',
    },
    ACTIVE_USERS_BY_ROLE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Active users by role retrieved successfully',
    },
    ROLE_COUNTS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'User counts by role retrieved successfully',
    },

    // Token validation
    TOKEN_VALIDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Token validated successfully',
    },

    // Fallback generic response
    GENERIC: (message: string) => ({
      httpCode: HTTP.SUCCESS,
      message: message || 'Operation completed successfully',
    }),
  };
};
