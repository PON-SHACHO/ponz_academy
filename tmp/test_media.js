const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function testMediaEndpoint() {
  const url = 'https://ponz-academy.vercel.app/api/v1/media';
  const username = process.env.API_USERNAME;
  const password = process.env.API_APP_PASSWORD;
  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  console.log(`Testing endpoint: ${url}`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: true })
    });

    console.log(`Status: ${response.status}`);
    const text = await response.text();
    console.log(`Response: ${text}`);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testMediaEndpoint();
