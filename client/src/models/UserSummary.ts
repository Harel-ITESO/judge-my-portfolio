import type { PostSummary } from './PostSummary'
import type { User } from './User'

export interface UserSummary extends User {
  posts: PostSummary[]
}
