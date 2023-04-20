import { SortDirections } from './types';

export type BlogsViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership?: boolean;
};

export class BlogsViewModelDTO {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt?: string,
    public isMembership?: boolean,
  ) {}
}

export type BlogsInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type QueryBlogs = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: SortDirections;
  pageNumber: number;
  pageSize: number;
};
