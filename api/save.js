const crypto = require('crypto');

function okPassword(pw) {
  const want = process.env.ADMIN_HASH || '';
  if (!pw || !want) return false;
  const got = crypto.createHash('sha256').update(String(pw)).digest('hex');
  const a = Buffer.from(got), b = Buffer.from(want);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.status(405).json({ error: 'Use POST' }); return; }
  if (!okPassword(req.headers['x-admin-password'])) {
    await new Promise(r => setTimeout(r, 900));
    res.status(401).json({ error: 'Wrong password' });
    return;
  }
  if (req.query && req.query.check) { res.status(200).json({ ok: true }); return; }
  try {
    const d = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const need = ['name', 'fullName', 'role', 'bio', 'skills', 'about', 'seasons', 'picks', 'links', 'stats', 'education', 'experience', 'moments', 'certs', 'projects'];
    if (!d || typeof d !== 'object' || need.some(k => !(k in d))) { res.status(400).json({ error: 'Content is incomplete' }); return; }
    const { put } = await import('@vercel/blob');
    await put('portfolio-content.json', JSON.stringify(d), { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60 });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Could not save: ' + (e && e.message ? e.message : 'unknown') });
  }
};
