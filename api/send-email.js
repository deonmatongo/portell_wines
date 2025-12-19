import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key is set
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ 
      error: 'Email service not configured. RESEND_API_KEY is missing.' 
    });
  }

  try {
    const { from, to, subject, html } = req.body;

    // Validate required fields
    if (!to || !subject || !html) {
      return res.status(400).json({ 
        error: 'Missing required fields: to, subject, or html' 
      });
    }

    // Use Resend's default domain if portell.wine is not verified
    // For testing, you can use onboarding@resend.dev
    // For production, verify your domain in Resend dashboard and use your domain
    const fromEmail = from || 'Portell Winery <onboarding@resend.dev>';

    console.log('Attempting to send email:', {
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      hasHtml: !!html
    });

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend API error:', error);
      return res.status(500).json({ 
        error: error.message || 'Failed to send email',
        details: error 
      });
    }

    console.log('Email sent successfully:', data);
    return res.status(200).json({ 
      success: true, 
      id: data.id,
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: error.toString()
    });
  }
}

