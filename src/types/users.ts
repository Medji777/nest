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
