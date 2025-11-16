-- Manual role assignment for existing users (in case they signed up before trigger was in place)
-- This is a one-time fix for tahir.mehmood22011@gmail.com if they already exist

DO $$
DECLARE
  reviewer_user_id uuid;
  admin_user_id uuid;
BEGIN
  -- Get user ID for tahir.mehmood22011@gmail.com from profiles
  SELECT id INTO reviewer_user_id FROM public.profiles WHERE email = 'tahir.mehmood22011@gmail.com';
  
  -- Get user ID for tahirmehmood24898@gmail.com from profiles
  SELECT id INTO admin_user_id FROM public.profiles WHERE email = 'tahirmehmood24898@gmail.com';
  
  -- Only insert if user exists and doesn't already have the role
  IF reviewer_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (reviewer_user_id, 'reviewer'::app_role, reviewer_user_id)
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Assigned reviewer role to tahir.mehmood22011@gmail.com';
  ELSE
    RAISE NOTICE 'User tahir.mehmood22011@gmail.com does not exist yet - they need to sign up first';
  END IF;
  
  -- Assign admin role if exists
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (admin_user_id, 'admin'::app_role, admin_user_id)
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Assigned admin role to tahirmehmood24898@gmail.com';
  ELSE
    RAISE NOTICE 'User tahirmehmood24898@gmail.com does not exist yet - they need to sign up first';
  END IF;
END $$;