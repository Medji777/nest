import { SortDirections } from './types';

export type UserInputModel = {
  login: string;
  password: string;
  email: string;
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt?: string;
};

export type BanInfoModel = {
  isBanned: boolean;
  banDate: string | null;
  banReason: string | null;
}

export type BanInputModel = Omit<BanInfoModel, 'banDate'>

export type UserViewModelSA = UserViewModel & {
  banInfo: BanInfoModel
}

export type PasswordHash = {
  passwordHash: string;
};

export type QueryUsers = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: string;
  sortDirection: SortDirections;
  pageNumber: number;
  pageSize: number;
};

export type ConfirmModel = {
  confirmationCode?: string | null;
  expirationDate?: Date;
  isConfirmed: boolean;
};

export type EmailConfirmUserModel = ConfirmModel;

export type PasswordConfirmUserModel = ConfirmModel;
