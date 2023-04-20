import { SortDirections } from '@type/types';

export const getSortNumber = (sort: SortDirections) =>
  SortDirections.desc === sort ? -1 : 1;
