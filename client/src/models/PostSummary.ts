export interface PostSummary {
  postId: number
  postName: string
  repositoryLink: string
  browserLink: string
  totalRating: number
  viewCount: number
  thumbnailImage: string
  createdBy: { username: string }
}
