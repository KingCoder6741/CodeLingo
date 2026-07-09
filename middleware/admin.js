export function adminAuth(req, res, next) {
  const adminKey = req.headers['x-admin-key'] || req.query.admin_key;

  if (adminKey !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  next();
}
