export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error || !code) {
    return res.redirect('/?tiktok=error');
  }

  const clientKey = process.env.VITE_TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = 'https://reeliq.vercel.app/auth/tiktok/callback';

  try {
    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

 const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return res.redirect('/?tiktok=error');
    }

    const userRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();
    const user = userData.data?.user;

    return res.redirect(`/?tiktok=success&name=${encodeURIComponent(user?.display_name || 'TikTok User')}&avatar=${encodeURIComponent(user?.avatar_url || '')}`);

  } catch (err) {
    return res.redirect('/?tiktok=error');
  }
}
