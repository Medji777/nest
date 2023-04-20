export type FieldError = {
  message: string | null;
  field: string | null;
};

export type APIErrorResult = {
  errorsMessages: Array<FieldError>;
};

export type Paginator<T> = {
  pagesCount?: number;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  items: Array<T>;
};

export enum Resolutions {
  P144 = 'P144',
  P240 = 'P240',
  P360 = 'P360',
  P480 = 'P480',
  P720 = 'P720',
  P1080 = 'P1080',
  P1440 = 'P1440',
  P2160 = 'P2160',
}

export enum Statuses {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UN_AUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TOO_MANY_REQUEST = 429,
  INTERNAL_SERVER_ERROR = 500,
}

export enum SortDirections {
  asc = 'asc',
  desc = 'desc',
}

export enum SearchTermQuery {
  searchNameTerm = 'searchNameTerm',
  searchLoginTerm = 'searchLoginTerm',
  searchEmailTerm = 'searchEmailTerm',
}

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}
