import { supabase } from '@/integrations/supabase/client';

export const sendAdminEmailNotification = async (
  policyTitle: string,
  policyAuthor: string,
  policyId: string
) => {
  try {
    // Get all admin users
    const { data: adminUsers, error: adminError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (adminError) throw adminError;

    if (!adminUsers || adminUsers.length === 0) {
      console.log('No admin users found to notify');
      return;
    }

    // Send email to each admin
    for (const adminUser of adminUsers) {
      try {
        // Get admin's email from profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', adminUser.user_id)
          .single();

        if (profileError || !profile?.email) {
          console.warn(`Could not find email for admin user ${adminUser.user_id}`);
          continue;
        }

        // Send email notification
        const { error: emailError } = await supabase.functions.invoke('send-policy-notification', {
          body: {
            adminEmail: profile.email,
            policyTitle,
            policyAuthor,
            policyId,
          },
        });

        if (emailError) {
          console.error(`Failed to send email to ${profile.email}:`, emailError);
        } else {
          console.log(`Email notification sent to ${profile.email}`);
        }
      } catch (error) {
        console.error('Error sending email to admin:', error);
      }
    }
  } catch (error) {
    console.error('Error in sendAdminEmailNotification:', error);
    // Don't throw - we don't want email failures to break the main flow
  }
};
