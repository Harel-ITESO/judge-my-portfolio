export class PostSummary {
  postId: number;
  postName: string;
  repositoryLink: string;
  browserLink: string;
  thumbnailImage: string;
  viewCount: number;
  createdBy: string;
  averageRating: number | string; // SQL returns a string, but needs to be converted to a number
}
