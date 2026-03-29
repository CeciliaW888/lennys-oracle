/**
 * /api/health — Lightweight health check endpoint.
 * Returns API key status, uptime, and request stats.
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const hasKey = !!process.env.GEMINI_API_KEY

  return res.status(200).json({
    status: 'ok',
    service: 'lennys-oracle',
    hasApiKey: hasKey,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production',
  })
}
