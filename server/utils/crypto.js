const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

const createToken = (user) => jwt.sign({ sub: user.id, username: user.username, role: user.role }, env.jwtSecret, { expiresIn: '7d' });

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (error) {
    return null;
  }
};

const hashValue = (value) => crypto.createHash('sha256').update(value).digest('hex');

const encryptSecret = (value) => {
  if (!value) return null;
  const key = crypto.createHash('sha256').update(env.jwtSecret).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

const decryptSecret = (value) => {
  if (!value) return null;
  const [ivHex, encryptedHex] = value.split(':');
  if (!ivHex || !encryptedHex) return null;

  const key = crypto.createHash('sha256').update(env.jwtSecret).digest();
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = {
  createToken,
  verifyToken,
  hashValue,
  encryptSecret,
  decryptSecret
};
