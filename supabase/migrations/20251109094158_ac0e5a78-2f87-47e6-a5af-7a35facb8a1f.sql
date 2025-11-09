-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table (SECURE: separate from profiles)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create notifications table for admin alerts
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    policy_id UUID REFERENCES public.policies(id) ON DELETE CASCADE
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Function to notify admins when policy needs review
CREATE OR REPLACE FUNCTION public.notify_admins_policy_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only notify when status changes to under_review
  IF NEW.status = 'under_review' AND (OLD.status IS NULL OR OLD.status != 'under_review') THEN
    -- Insert notifications for all admin users
    INSERT INTO public.notifications (user_id, type, title, message, link, policy_id)
    SELECT 
      ur.user_id,
      'policy_review',
      'Policy Needs Review',
      'Policy "' || NEW.title || '" has been submitted for review by ' || NEW.author,
      '/policy/' || NEW.id,
      NEW.id
    FROM public.user_roles ur
    WHERE ur.role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to notify admins when policy needs review
CREATE TRIGGER notify_admins_on_policy_review
AFTER INSERT OR UPDATE ON public.policies
FOR EACH ROW
EXECUTE FUNCTION public.notify_admins_policy_review();

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Create index for better performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

COMMENT ON TABLE public.user_roles IS 'Secure storage for user roles - separated from profiles to prevent privilege escalation';
COMMENT ON TABLE public.notifications IS 'User notifications for policy reviews and system events';
COMMENT ON FUNCTION public.has_role IS 'Security definer function to check user roles without RLS recursion';