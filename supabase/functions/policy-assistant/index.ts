import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Initialize Supabase client for fetching policies
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let systemPrompt = '';
    
    // Different system prompts based on action
    if (action === 'generate_summary') {
      systemPrompt = `You are a policy document assistant. Generate concise, professional policy content based on user descriptions. 
      Format the output as a complete policy with:
      - Title
      - Purpose
      - Scope
      - Key requirements (numbered list)
      - Compliance considerations
      Keep it clear, actionable, and formal.`;
    } else if (action === 'recommend_policies') {
      // Fetch all active policies to provide context
      const { data: policies } = await supabase
        .from('policies')
        .select('id, title, description, type, department, security_domain')
        .eq('status', 'active')
        .limit(50);

      const policiesContext = policies 
        ? policies.map(p => `- ${p.title} (Type: ${p.type}, Dept: ${p.department || 'General'})`).join('\n')
        : 'No policies available';

      systemPrompt = `You are a policy recommendation assistant. Based on the user's role and responsibilities, recommend relevant policies they should read.
      
Available policies:
${policiesContext}

Provide 3-5 specific policy recommendations with brief explanations of why they're relevant to their role.`;
    } else {
      // General Q&A mode
      systemPrompt = `You are a helpful policy assistant. Answer questions about organizational policies, compliance, and security practices.
      Be concise, accurate, and provide actionable guidance. If you don't know something, say so.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in policy-assistant:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
