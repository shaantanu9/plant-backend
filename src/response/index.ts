// touch service.response.ts matchmaking.response.ts jobseeker.response.ts serviceprovider.response.ts joblisting.response.ts review.response.ts message.response.ts preference.response.ts
import ACTIVITY from './activity.response';
// import MESSAGE from "./message.response";
import CONTAINER from './container.response';
import DELIVERY from './delivery.response';
import DELIVERY_PERSONNEL from './deliveryPersonnel.response';
import ITEM from './item.response';
import PREFERENCES from './preference.response';
import REPORT from './report.response';
import SUBSCRIBER from './subscriber.response';
import SUBSCRIPTION from './subscription.response';
import USER from './user.response';
export const SUCCESS = {
  DEFAULT: {
    httpCode: 200,
    statusCode: 200,
    message: 'Success',
  },
};

export const RESPONSE = {
  USER,
  SUCCESS,
  SUCCESS_MESSAGE: (message: string) => ({
    httpCode: 200,
    statusCode: 200,
    message,
  }),
  ACTIVITY,
  // MESSAGE,
  PREFERENCES,
  CONTAINER,
  REPORT,
  DELIVERY,
  DELIVERY_PERSONNEL,
  SUBSCRIBER,
  ITEM,
  SUBSCRIPTION,
};
