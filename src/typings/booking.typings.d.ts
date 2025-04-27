import { Types } from 'mongoose';

export as namespace IBooking;

export interface BookingSchema {
  _id: Types.ObjectId;
  userDetail: {
    _id: Types.ObjectId;
    name: string;
    email: string;
    profileImage: string;
  };
  hostDetail: {
    name: string;
    email: string;
  };
  bookingId: Types.String;
  userId: Types.String;
  hostId: string;
  status: (typeof ENUM.BOOKING.STATUS)[keyof typeof ENUM.BOOKING.STATUS];
  guestCount: number;
  toDate: Date;
  fromDate: Date;
  space: {
    _id: Types.ObjectId;
    name: string;
    basePrice: number;
    archilogicId: string;
    images: [string];
    category: {
      _id: Types.ObjectId;
      name: string;
    };
    amenities: [
      {
        _id: Types.ObjectId;
        name: string;
      },
    ];
    guestCapacity: number;
    timeSlot: {
      _id: Types.ObjectId;
      name: string;
      price: number;
      startTime: string;
      endTime: string;
    };
  };
  area: {
    _id: Types.ObjectId;
    name: string;
    floorPlanId: string;
  };
  location: {
    _id: Types.ObjectId;
    name: string;
    address: string;
    image: string;
  };
  bookingDuration: {
    day: number;
    hour: number;
    minutes: number;
    totalDuration: number;
  };
  bookingAgenda: string;
  paymentStatus: (typeof ENUM.PAYMENT.STATUS)[keyof typeof ENUM.PAYMENT.STATUS];
  paymentUrl: string;
  paymentId: Types.ObjectId;
  bookingType: (typeof ENUM.BOOKING.BOOKING_TYPE)[keyof typeof ENUM.BOOKING.BOOKNG_TYPE];
  isEmployee: boolean;
  basePrice: number;
  totalPayable: number;
  taxPercentage: number;
  taxPrice: number;
  adminCommissionPercentage: number;
  adminCommissionAmount: number;
}
export interface updateBookingStatusFromWebhookPayload {
  feeDetails: {
    application_fee_amount: number;
    transaction_fee: number;
    amount: number;
  };
  stripeTransactionId: string;
  offset: string;
  bookingId: string;
  paymentStatus: number;
}
