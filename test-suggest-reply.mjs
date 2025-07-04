// Test suggest reply API endpoint
import { config as loadEnv } from "dotenv";
loadEnv();

async function testSuggestReply() {
  const baseUrl = 'http://localhost:5000';
  
  try {
    console.log('🧪 Testing suggest reply API...\n');

    // First login to get authentication
    const loginResponse = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'polarbear', // Use existing user
        password: 'polarbear123'
      }),
      credentials: 'include'
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    console.log('✅ Login successful');

    // Now test suggest reply
    const suggestResponse = await fetch(`${baseUrl}/api/ai/suggest-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messageContent: "Hello, how are you today?",
        threadContext: [],
        orgContext: "Test conversation",
        generateMultiple: true
      }),
      credentials: 'include'
    });

    console.log('Response status:', suggestResponse.status);
    console.log('Response headers:', Object.fromEntries(suggestResponse.headers.entries()));

    if (!suggestResponse.ok) {
      const errorText = await suggestResponse.text();
      console.error('❌ Suggest reply failed:', errorText);
      return;
    }

    const suggestions = await suggestResponse.json();
    console.log('✅ Suggest reply successful:');
    console.log(JSON.stringify(suggestions, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSuggestReply();
