export const API =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_DEV
    : window.location.protocol === 'http:'
    ? process.env.REACT_APP_PROD
    : process.env.REACT_APP_SECURED_PROD;
export const ICON = 'TICKETING SYSTEM';
export const APP_SECRET = process.env.REACT_APP_SECRET_KEY;
