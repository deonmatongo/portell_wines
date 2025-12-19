import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  // Check if API key is set
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return new Response(
      JSON.stringify({ 
        error: 'Email service not configured. RESEND_API_KEY is missing.' 
      }),
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();
    const { from, to, subject, html } = body;

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: to, subject, or html' 
        }),
        { status: 400, headers }
      );
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
      return new Response(
        JSON.stringify({ 
          error: error.message || 'Failed to send email',
          details: error 
        }),
        { status: 500, headers }
      );
    }

    console.log('Email sent successfully:', data);
    return new Response(
      JSON.stringify({ 
        success: true, 
        id: data.id,
        message: 'Email sent successfully' 
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { status: 500, headers }
    );
  }
}

