export interface Account {
  accountId: string;
  email: string;
  serviceProvider: string;
  imageUrl: string;
  username: string;
  createdOn: Date;
}

export interface Comment {}

export interface PortfolioCardPost {
  postId: string;
  createdBy: Account;
  createdOn: string;
  viewCount: number;
  repositoryLink: string;
  webLink: string;
  thumbnailImage: string;
  comments: Comment[];
  account: Account;
}
