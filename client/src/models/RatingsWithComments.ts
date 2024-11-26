export interface RatingsWithComments {
  stars: number
  comment: string | null
  ratedBy: { username: string; profilePicUrl: string }
}
