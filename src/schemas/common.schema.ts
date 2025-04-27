import { array, boolean, number, object, string } from 'zod';

export const commonSchema = {
  name: string({
    required_error: 'Name is required',
  })
    .max(50, 'Name must be less than 50 characters')
    .min(2)
    // .regex(/^[a-zA-Z0-9 ]*$/, "Name must contain only alphabets"),
    .regex(/^[a-zA-Z0-9 .]*$/, 'Name must contain only alphabets, numbers, periods, and spaces'),

  email: string({
    required_error: 'Email is required',
  }).email('Not a valid email'),
  password: string({
    required_error: 'Password is required',
  }).min(6, 'Password must be at least 6 characters'),
  description: string().max(500, 'Description must be less than 500 characters'),
  mongoId: string().regex(/^[0-9a-fA-F]{24}$/, 'Not a valid mongo id'),
  mobile: string()
    .min(10)
    .max(10)
    .regex(/^[0-9]*$/, 'Not a valid mobile number'),
};

export const VALIDATOR = {
  USER: {
    CREATE: object({
      name: commonSchema.name,
      // email: commonSchema.email,
      mobile: commonSchema.mobile.optional(),

      password: commonSchema.password,
      email: commonSchema.email,
      referralCode: string().optional(),
      // captcha: string({
      //   required_error: "Captcha is required",
      // }),
    }),
    LOGIN: object({
      email: commonSchema.email,
      password: commonSchema.password,
    }),
    UPDATE: object({
      name: commonSchema.name,
      email: commonSchema.email,
      password: commonSchema.password,
      favouriteSpaces: array(string()).nonempty(),
    }),
  },
};

export const BusinessCreateSchema = object({
  name: commonSchema.name,
  description: commonSchema.description,
  type: string(),
  owners: array(commonSchema.mongoId),
  employees: array(
    object({
      employeeId: commonSchema.mongoId,
      role: string(),
    }),
  ),
  address: object({
    street: string(),
    city: string(),
    state: string(),
    postalCode: string(),
    country: string(),
  }),
});

export const BusinessUpdateSchema = object({
  name: commonSchema.name.optional(),
  description: commonSchema.description.optional(),
  type: string().optional(),
  address: object({
    street: string().optional(),
    city: string().optional(),
    state: string().optional(),
    postalCode: string().optional(),
    country: string().optional(),
  }).optional(),
});

export const ProductCreateSchema = object({
  name: commonSchema.name,
  description: commonSchema.description,
  price: number(),
  availableFor: array(string()), // This needs ENUM values defined elsewhere
  category: string(),
  quantity: number(),
  isSubscriptionAvailable: boolean(),
  subscriptionPlans: array(
    object({
      frequency: string(),
      price: number(),
    }),
  ),
  rentalDetails: object({
    dailyPrice: number(),
    weeklyPrice: number(),
    monthlyPrice: number(),
    deposit: number(),
  }),
});

export const ProductUpdateSchema = object({
  name: commonSchema.name.optional(),
  description: commonSchema.description.optional(),
  price: number().optional(),
  quantity: number().optional(),
});

// export const SubscriptionCreateSchema = object({
//   customerId: commonSchema.mongoId,
//   productId: commonSchema.mongoId,
//   businessId: commonSchema.mongoId,
//   frequency: string(),
//   startDate: string(),
//   nextDeliveryDate: string(),
//   active: boolean(),
// });

// export const SubscriptionUpdateSchema = object({
//   nextDeliveryDate: string().optional(),
//   active: boolean().optional(),
// });
