// Add imports for the new builder modules
import * as CONTAINER from './container/container.builder';
import * as DELIVERY from './delivery/delivery.builder';
import * as DELIVERY_PERSONNEL from './deliveryPersonnel/deliveryPersonnel.builder';
import * as ITEM from './item/item.builder';
import * as REPORT from './report/report.builder';
import * as SUBSCRIBER from './subscriber/subscriber.builder';
import * as SUBSCRIPTION from './subscription/subscription.builder';
import * as USER from './user/user.builder';
const builder = {
  USER,
  CONTAINER,
  DELIVERY,
  DELIVERY_PERSONNEL,
  ITEM,
  REPORT,
  SUBSCRIBER,
  SUBSCRIPTION,
};

export default builder;
