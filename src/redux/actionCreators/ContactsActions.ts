import constants from '../actionConstants/ContactsConstants';
import { CALL_API } from '../actionConstants/ApiMiddlewareConstants';
import Notifications from 'utils/Notifications';

export const getApiMiddlewareActionCreator = actionCreator => {
 actionCreator.type = 'API_MIDDLEWARE_REQUEST';
  return actionCreator;
};

export const loadInvoice = id => {
  return getApiMiddlewareActionCreator({
    [CALL_API]: {
      endpoint: `${config.apiBaseUrl}invoice/${id}`,
      method: 'GET',
      credentials: 'include',
      types: [
        constants.REQUEST,
        {
          type: constants.SUCCESS,
          payload(action, state, res) {
            return res.json();
          }
        },
        {
          type: constants.FAILURE,
          meta(action, state, res) {
            Notifications.postError(res);
          }
        }
      ]
    }
  });
};