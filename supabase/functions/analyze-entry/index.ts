import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { OpenAI } from 'https://deno.land/x/openai@v4.24.1/mod.ts'; // Ensure this is a Deno-compatible version

// CORS headers - adjust as needed for your security requirements
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or your specific frontend URL
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // OPTIONS is important for preflight requests
};

serve(async (req: Request) => {
  // Handle OPTIONS preflight request for CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { entryContent } = await req.json();
    if (!entryContent) {
      return new Response(JSON.stringify({ error: 'Missing entryContent in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables.');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that analyzes text sentiment.' },
        {
          role: 'user',
          content: `Analyze the sentiment of the following text. Respond with only one word: Positive, Negative, or Neutral. Text: ${entryContent}`,
        },
      ],
      max_tokens: 10, 
      temperature: 0.2,
    });

    const sentiment = completion.choices[0]?.message?.content?.trim() || 'Could not determine';

    return new Response(JSON.stringify({ sentiment }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to analyze sentiment' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// To deploy this function:
// 1. Ensure you have the Supabase CLI installed and are logged in.
// 2. Navigate to your Supabase project root in the terminal.
// 3. Run: supabase functions deploy analyze-entry --no-verify-jwt (or manage JWTs as needed)
//
// To set environment variables like OPENAI_API_KEY for your deployed function:
// supabase secrets set OPENAI_API_KEY=your_actual_api_key
//
// Make sure to replace `your_actual_api_key` with your real OpenAI API key.
// After setting secrets, you might need to redeploy the function.
//
// Test locally using:
// supabase functions serve --no-verify-jwt
//
// And then send a POST request to: http://localhost:54321/functions/v1/analyze-entry
// Body: { "entryContent": "Today was a wonderful day!" }
// Headers: { "Content-Type": "application/json" }
// (You might need an Authorization header with a Supabase service_role key if not using --no-verify-jwt)
//
// Note on Deno OpenAI library:
// The import path for OpenAI might change. Ensure you're using a version compatible with Deno.
// Check the library's documentation for Deno-specific instructions if available.
// The path 'https://deno.land/x/openai@v4.24.1/mod.ts' is an example and might need updating.
