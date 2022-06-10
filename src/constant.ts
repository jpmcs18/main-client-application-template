export const API =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_DEV
    : window.location.protocol === 'http:'
    ? process.env.REACT_APP_PROD
    : process.env.REACT_APP_SECURED_PROD;
export const ICON = 'TICKETING SYSTEM';
export const APP_SECRET = process.env.REACT_APP_SECRET_KEY;
export const ConcernStatus = {
  Open: 1,
  Assign: 2,
  Close: 3,
};
export const PersonnelConcernStatus = {
  Pending: 1,
  Resolved: 2,
  Forwarded: 3,
};
