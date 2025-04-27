import axios from 'axios';
import { Types } from 'mongoose';
import { CONFIG } from '@common';
// const fast2sms = require("fast-two-sms");
export * from './imageKitAuth';
export * from './scraper';
export * from './gemeniModel';
export * from './subtitle';
export * from './journalSummary';
export * from './convertText2Quiz';
export async function logger(...data: any) {
  try {
    if (CONFIG.NODE_ENV !== 'prod') {
      data.map((elem: any) => {
        console.log(elem);
      });
    } else {
      return;
    }
  } catch (error) {
    console.error(`we have an error ==> ${error}`);
  }
}

export const OTPGenerator = (num: number) => {
  let otp = '';
  let sum = 0;
  for (let i = 0; i < num - 1; i++) {
    const digit = Math.floor(Math.random() * 10);
    otp += digit.toString();
    sum += digit;
  }
  const lastDigit = (9 - (sum % 9)) % 9;
  otp += lastDigit.toString();
  return otp;
};

export const validateRestrictedOTP = (otp: string): boolean => {
  if (otp.length !== 6) return false;

  const digits = otp.split('').map(Number);
  const sum = digits.reduce((acc, curr) => acc + curr, 0);

  // Check if the sum of digits is divisible by 9
  return sum % 9 === 0;
};

export function toObjectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}

export async function sendOtp(mobile: string, otp: string) {
  const apiUrl = `https://2factor.in/API/V1/${CONFIG.TWO_FACTOR_API_KEY}/SMS/+91${mobile}/${otp}/OTP1';`;
  try {
    axios
      .get(apiUrl)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
  } catch (error) {
    console.log(error);
    return error;
  }
}

const YOUR_API_KEY =
  'Aey1u9LzpZBOqsGJcRoUMrCSw7X25E6jQvifKxVnhtIY3T80bkF2QISayVtTACGuLMspji460PcvoxgB';

export const sendOtpFast2SMS = async ({ number, otp }: any) => {
  try {
    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: YOUR_API_KEY,
        variables_values: otp,
        route: 'otp',
        numbers: number,
      },
      headers: {
        'cache-control': 'no-cache',
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error(error.message);
  }
};
