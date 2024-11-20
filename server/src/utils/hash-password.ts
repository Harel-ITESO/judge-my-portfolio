import { hash, compare } from 'bcrypt';

/**
 * Hashes a password
 * @param password  The password to hash
 * @returns hashed password
 */
export async function hashPassword(password: string) {
  return await hash(password, 10);
}

/**
 * Compares a given password with a hashed password
 * @param source The given password
 * @param hashTarget hashed from database
 * @returns true or false if the passwords match
 */
export async function comparePasswords(source: string, hashTarget: string) {
  return await compare(source, hashTarget);
}
