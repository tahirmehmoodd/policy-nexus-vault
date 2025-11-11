import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationRequest {
  adminEmail: string;
  policyTitle: string;
  policyAuthor: string;
  policyId: string;
}

interface OwnerNotificationRequest {
  ownerEmail: string;
  policyTitle: string;
  decision: 'approved' | 'rejected';
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Check if this is an admin notification or owner notification
    if (body.adminEmail) {
      const { adminEmail, policyTitle, policyAuthor, policyId }: AdminNotificationRequest = body;

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
          </div>
        `,
      });

      return new Response(JSON.stringify(emailResponse), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } else if (body.ownerEmail) {
      const { ownerEmail, policyTitle, decision, rejectionReason }: OwnerNotificationRequest = body;

      const isApproved = decision === 'approved';
      const emailResponse = await resend.emails.send({
        from: "Policy System <onboarding@resend.dev>",
        to: [ownerEmail],
        subject: `Policy ${isApproved ? 'Approved' : 'Rejected'}: ${policyTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: ${isApproved ? '#22c55e' : '#ef4444'};">
              Policy ${isApproved ? 'Approved' : 'Rejected'}
            </h2>
            <p>Your policy has been ${isApproved ? 'approved' : 'rejected'}:</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Policy Title:</strong> ${policyTitle}</p>
              ${!isApproved && rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
            </div>
            <p>${isApproved ? 'Your policy is now live and visible to all users.' : 'Please review the feedback and resubmit your policy for review.'}</p>
          </div>
        `,
      });

      return new Response(JSON.stringify(emailResponse), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    throw new Error("Invalid request: missing required fields");
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
