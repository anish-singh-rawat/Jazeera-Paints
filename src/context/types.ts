export type ErrCallbackType = (err: { [key: string]: string }) => void;

export type LoginParams = {
  userName: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterParams = {
  email: string;
  username: string;
  password: string;
};

export type ForgetPasswordParams = {
  email: string;
};

export type ResetpasswordParams = {
  password: string;
  email: string;
  token: string;
};

export type ValidateOtpParams = {
  email: string;
  username: string;
  password: string;
};

export interface Permission {
  id: number;
  name: string;
  createdBy: string;
  code: string;
}
export interface PermissionType {
  Create: boolean;
  Read: boolean;
  Edit: boolean;
  Delete: boolean;
  Allowed?:boolean;
}
export interface RolePermission {
  permissionId: number;
  createAccess: boolean;
  readAccess: boolean;
  editAccess: boolean;
  deleteAccess: boolean;
  permissions: Permission;
  permissionType: PermissionType;
}

export interface UserType {
  id: number;
  uuid: string;
  name: string;
  altName: string;
}

export interface Role {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
  userType: UserType;
  rolePermissions: RolePermission[];
}

export interface CreatePassword {
  id: string | number;
  mobileNumber: string | number;
  password: string | number;
}

export interface TwoFactorAuth {
  mobileNumber: string | number;
  token: string | number;
}

export interface resendOTPTypes {
  mobileNumber: string | number;
}

export interface UserDataType {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  userName: string;
  active: boolean;
  password: string;
  roleId: number;
  role: Role;
  token: string;
  isTempPassword: boolean;
  isTwoFactorAuth: boolean;
  company:{
    altName:string;
    code:string;
    currency:{
      id:number;
      uuid:string;
      code:string;
      name:string;
      altName:string;
    },
    id:number,
    uuid:string,
    name:string
  }
}

export type AuthValuesType = {
  loading: boolean;
  logout: (redirect?: boolean) => void;
  user: UserDataType | null;
  setLoading: (value: boolean) => void;
  setUser: (value: UserDataType | null) => void;
  isAuthenticUser: boolean;
  login: (
    params: LoginParams,
    errorCallback?: (a: Record<string, any>) => void
  ) => void;

  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void;
  forgetPassword: (
    params: ForgetPasswordParams,
    loading: (a: boolean) => void
  ) => void;
  resetpassword: (
    params: ResetpasswordParams,
    cb?: (a: boolean) => void,
    err?: (a: string) => void
  ) => void;
  validateOtp: (
    params: ValidateOtpParams,
    errorCallback?: ErrCallbackType
  ) => void;
  createPassword: (
    params: CreatePassword,
    errorCallback?: (a: Record<string, any>) => void
  ) => void;
  twoFactorAuth: (
    params: TwoFactorAuth,
    errorCallback?: (a: Record<string, any>) => void
  ) => void;

  resendOTP: (params: resendOTPTypes) => void;

  handleResetPasswordRedirectAuth: (
    params: { email: string; token: string },
    cb: (b: boolean) => void,
    err: (msg: string) => void
  ) => void;
};
