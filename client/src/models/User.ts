export interface User {
  email: string
  username: string
  userId: number
  authenticationProvider: string
  createdOn: Date
  profilePicUrl: string | null
}
