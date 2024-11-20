import * as crypto from 'crypto';

export function generateAvatar(username: string, size = 80) {
  const hash = crypto.createHash('sha256').update(username).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}
