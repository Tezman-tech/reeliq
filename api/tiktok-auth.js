export default async function handler(req, res) {
  const clientKey = process.env.VITE_TIKTOK_CLIENT_KEY;
  const redirectUri = 'https://reeliq.vercel.app/auth/tiktok/callback';
  const scope = 'user.info.basic';
  const state = Math.random().toString(36).substring(7);

  const params = new URLSearchParams({
    client_key: clientKey,
    scope: scope,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
  });

  const authUrl = `https://www.tiktok.com/v2/auth/authorize?${params.toString()}`;

  res.setHeader('Location', authUrl);
  res.status(302).end();
}
