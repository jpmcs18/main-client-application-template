export const SecurityEnd = {
  Refresh: 'securities/refresh',
  Login: 'securities/log',
};

export const UserEnd = {
  GetData: 'users/profile',
  Search: 'users/search',
  Activate: 'users/activate',
  ResetPassword: 'users/reset-password',
  Delete: 'users',
  Create: 'users',
  Update: 'users',
  UpdateProfile: 'users/profile',
};

export const ConcernEnd = {
  Search: 'concerns/search',
  Create: 'concerns',
  Update: 'concerns',
  Delete: 'concerns',
  Assign: 'concerns/assign',
};

export const ClassificationEnd = {
  GetList: 'classifications',
  Get: 'classifications',
};

export const OfficeEnd = {
  GetList: 'offices',
  Get: 'offices',
};

export const PersonnelEnd = {
  GetList: 'personnels',
  GetListByClassification: 'personnels/classification',
  GetAvailableListByClassification: 'personnels/classification/available',
  Get: 'personnels',
};

export const PersonnelConcernEnd = {
  GetList: 'personnel-concerns',
  GetActions: 'personnel-concerns/actions',
};
