export as namespace IUtil;

export interface BookingPricePayload {
  spacePrice: number;
  taxPercentage: number;
  adminCommissionPercentage: number;
}

export interface BookingPriceCalculationResponse {
  basePrice: number;
  taxPercentage: number;
  adminCommissionPercentage: number;
  taxPrice: number;
  totalPayable: number;
  adminCommissionAmount: number;
}

export interface CalculateBookingDurationResponse {
  day: number;
  hour: number;
  minutes: number;
  totalDuration: number;
}
