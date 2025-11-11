-- Update the handle_new_user function to assign editor role to tahirmehmood98824@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Assign role based on email
  IF NEW.email = 'tahirmehmood24898@gmail.com' THEN
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (NEW.id, 'admin'::app_role, NEW.id);
  ELSIF NEW.email = 'tahirmehmood98824@gmail.com' THEN
    -- Assign editor role to this specific email
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (NEW.id, 'editor'::app_role, NEW.id);
  ELSE
    -- Default to editor for all other new users
    INSERT INTO public.user_roles (user_id, role, created_by)
    VALUES (NEW.id, 'editor'::app_role, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;