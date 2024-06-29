import { Prisma } from '@prisma/client';

// Account types
export type AccountWithPosts = Prisma.AccountGetPayload<{
  include: {
    posts: true;
  };
}>;

export type AccountWithComments = Prisma.AccountGetPayload<{
  include: {
    comments: true;
  };
}>;

export type AccountFull = Prisma.AccountGetPayload<{
  include: {
    comments: true;
    posts: true;
  };
}>;

// Post types

export type PostWithAuthor = Prisma.PostGetPayload<{
  include: {
    createdBy: true;
  };
}>;

export type PostWithComments = Prisma.PostGetPayload<{
  include: {
    comments: true;
  };
}>;

export type PostFull = Prisma.PostGetPayload<{
  include: {
    comments: true;
    createdBy: true;
  };
}>;
