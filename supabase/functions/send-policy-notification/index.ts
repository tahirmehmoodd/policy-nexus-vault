import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  adminEmail: string;
  policyTitle: string;
  policyAuthor: string;
  policyId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adminEmail, policyTitle, policyAuthor, policyId }: NotificationRequest = await req.json();

    console.log("Sending email notification to:", adminEmail);

    const emailResponse = await resend.emails.send({
      from: "Policy System <onboarding@resend.dev>",
      to: [adminEmail],
      subject: "New Policy Awaiting Review",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Policy Submitted for Review</h2>
          <p>A new policy has been submitted and is awaiting your review:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Policy Title:</strong> ${policyTitle}</p>
            <p><strong>Submitted By:</strong> ${policyAuthor}</p>
          </div>
          <p>Please log in to the admin dashboard to review and approve or reject this policy.</p>
          <a href="${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '')}/admin/policies" 
             style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Review Policy
          </a>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
