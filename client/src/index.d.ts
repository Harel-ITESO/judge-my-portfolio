export interface Account {
  accountId: string;
  email: string;
  serviceProvider: string;
  imageUrl: string;
  username: string;
  createdOn: Date;
}

export interface Comment {}

export interface Portfolio {
  postId: string;
  postName: string;
  createdBy: Account;
  createdOn: string;
  viewCount: number;
  repositoryLink: string;
  webLink: string;
  thumbnailImage: string;
  comments: Comment[];
  account: Account;
}

export interface PortfolioCurrentUser {
  postId: string;
  postName: string;
  thumbnailImage: string;
}
