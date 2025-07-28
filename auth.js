// api/auth.js
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    if (!email.endsWith('@valify.me')) {
      return res.status(403).json({ success: false, message: 'Must use @valify.me email' });
    }

    return res.status(200).json({ success: true, email });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid token' });
  }
}
