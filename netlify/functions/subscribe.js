exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email } = JSON.parse(event.body || '{}');
  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const PUB_ID = 'pub_dc5a6067-fb66-4b06-bb30-7e80c0721c66';
  const API_KEY = process.env.BEEHIIV_API_KEY;

  const res = await fetch(`https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      email,
      reactivate_existing: false,
      send_welcome_email: true,
      utm_source: 'ironandorder.com',
      utm_medium: 'organic',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Beehiiv error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Subscription failed' }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
