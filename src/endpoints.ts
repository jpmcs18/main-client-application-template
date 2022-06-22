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
export const ModuleEnd = {
  GetList: 'modules',
};
export const RoleEnd = {
  Search: 'roles/search',
  GetList: 'roles',
  Delete: 'roles',
  Create: 'roles',
  Update: 'roles',
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
  Search: 'classifications/search',
  Add: 'classifications',
  Update: 'classifications',
};

export const OfficeEnd = {
  GetList: 'offices',
  Get: 'offices',
  Search: 'offices/search',
  Add: 'offices',
  Update: 'offices',
};

export const PersonnelEnd = {
  GetList: 'personnels',
  GetListByClassification: 'personnels/classification',
  GetAvailableListByClassification: 'personnels/classification/available',
  Get: 'personnels',
  Search: 'personnels/search',
  Add: 'personnels',
  Update: 'personnels',
};

export const PersonnelConcernEnd = {
  GetList: 'personnel-concerns',
  GetActions: 'personnel-concerns/actions',
  Resolve: 'personnel-concerns/resolve',
  Forward: 'personnel-concerns/forward',
};
