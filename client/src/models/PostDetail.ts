export interface Rating {
  stars: number
  ratedBy: { username: string; profilePicUrl: string }
}

export interface PostDetail {
  averageRatings: number
  postName: string
  description: string
  viewCount: string
  repositoryLink: string
  browserLink: string
  thumbnailImage: string
  createdBy: { username: string; profilePicUrl: string }
  ratings: Rating[]
}
