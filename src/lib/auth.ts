import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  // DEV overrides for testing
  if (token === 'YOUR_SELLER_TOKEN_HERE') {
    return { id: 1, role: 'seller', email: 'seller@test.com' }; 
  }
  if (token === 'YOUR_ADMIN_TOKEN_HERE_FOR_TESTING') {
    return { id: 1, role: 'admin', email: 'admin@test.com' };
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getUser(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return verifyToken(token) as { id: number, role: string, email: string } | null;
}
