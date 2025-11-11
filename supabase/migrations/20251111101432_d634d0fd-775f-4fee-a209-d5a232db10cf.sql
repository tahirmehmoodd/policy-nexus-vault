-- Update trigger to handle new status value 'review'
CREATE OR REPLACE FUNCTION public.notify_admins_policy_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only notify when status changes to review
  IF NEW.status = 'review' AND (OLD.status IS NULL OR OLD.status != 'review') THEN
    -- Insert notifications for all admin users
    INSERT INTO public.notifications (user_id, type, title, message, link, policy_id)
    SELECT 
      ur.user_id,
      'policy_review',
      'Policy Needs Review',
      'Policy "' || NEW.title || '" has been submitted for review by ' || NEW.author,
      '/admin/policies',
      NEW.id
    FROM public.user_roles ur
    WHERE ur.role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update handle_new_user to assign correct roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Assign role based on email
  IF NEW.email = 'tahirmehmood24898@gmail.com' THEN
    user_role := 'admin';
  ELSE
    user_role := 'editor';
  END IF;
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$function$;