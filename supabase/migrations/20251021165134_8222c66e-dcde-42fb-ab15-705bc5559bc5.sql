-- Fix security warnings: Add search_path to all functions

-- Fix update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Fix create_policy_version
CREATE OR REPLACE FUNCTION public.create_policy_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF OLD.content IS DISTINCT FROM NEW.content OR 
     OLD.title IS DISTINCT FROM NEW.title OR 
     OLD.description IS DISTINCT FROM NEW.description THEN
    
    INSERT INTO public.policy_versions (
      policy_id,
      version,
      title,
      description,
      content,
      tags,
      category,
      status,
      file_url,
      created_by
    ) VALUES (
      NEW.id,
      NEW.version,
      NEW.title,
      NEW.description,
      NEW.content,
      NEW.tags,
      NEW.category,
      NEW.status,
      NEW.file_url,
      NEW.updated_by
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$function$;

-- Fix log_policy_access
CREATE OR REPLACE FUNCTION public.log_policy_access(policy_id_param uuid, action_param text, ip_address_param inet DEFAULT NULL::inet, user_agent_param text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.policy_access_logs (policy_id, user_id, action, ip_address, user_agent)
  VALUES (policy_id_param, auth.uid(), action_param, ip_address_param, user_agent_param);
END;
$function$;

-- Fix log_search
CREATE OR REPLACE FUNCTION public.log_search(search_query_param text, search_filters_param jsonb DEFAULT '{}'::jsonb, results_count_param integer DEFAULT 0)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.search_logs (user_id, search_query, search_filters, results_count)
  VALUES (auth.uid(), search_query_param, search_filters_param, results_count_param);
END;
$function$;

-- Fix search_policies
CREATE OR REPLACE FUNCTION public.search_policies(search_query text DEFAULT ''::text, filter_tags text[] DEFAULT '{}'::text[], filter_category policy_category DEFAULT NULL::policy_category, filter_status policy_status DEFAULT NULL::policy_status)
RETURNS TABLE(id uuid, title text, description text, content text, tags text[], category policy_category, version numeric, status policy_status, file_url text, created_by uuid, updated_by uuid, created_at timestamp with time zone, updated_at timestamp with time zone, rank real)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.content,
    p.tags,
    p.category,
    p.version,
    p.status,
    p.file_url,
    p.created_by,
    p.updated_by,
    p.created_at,
    p.updated_at,
    CASE 
      WHEN search_query = '' THEN 0::real
      ELSE ts_rank(to_tsvector('english', p.title || ' ' || p.description || ' ' || p.content), plainto_tsquery('english', search_query))
    END as rank
  FROM public.policies p
  WHERE 
    (search_query = '' OR to_tsvector('english', p.title || ' ' || p.description || ' ' || p.content) @@ plainto_tsquery('english', search_query))
    AND (cardinality(filter_tags) = 0 OR p.tags && filter_tags)
    AND (filter_category IS NULL OR p.category = filter_category)
    AND (filter_status IS NULL OR p.status = filter_status)
  ORDER BY 
    CASE WHEN search_query = '' THEN p.updated_at END DESC,
    CASE WHEN search_query != '' THEN rank END DESC;
END;
$function$;

-- Fix search_policies_enhanced
CREATE OR REPLACE FUNCTION public.search_policies_enhanced(search_query text DEFAULT ''::text, filter_tags text[] DEFAULT '{}'::text[], filter_type text DEFAULT ''::text, filter_status text DEFAULT ''::text)
RETURNS TABLE(policy_id uuid, title text, description text, type text, status text, author text, created_at timestamp with time zone, updated_at timestamp with time zone, content text, tags text[], rank real)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as policy_id,
    p.title,
    p.description,
    p.type,
    p.status::text,
    p.author,
    p.created_at,
    p.updated_at,
    pt.content,
    ARRAY_AGG(DISTINCT t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL) as tags,
    CASE 
      WHEN search_query = '' THEN 0::real
      ELSE GREATEST(
        ts_rank(to_tsvector('english', p.title || ' ' || COALESCE(p.description, '')), plainto_tsquery('english', search_query)),
        ts_rank(to_tsvector('english', COALESCE(pt.content, '')), plainto_tsquery('english', search_query))
      )
    END as rank
  FROM public.policies p
  LEFT JOIN public.policy_texts pt ON p.id = pt.policy_id
  LEFT JOIN public.policy_tags ptags ON p.id = ptags.policy_id
  LEFT JOIN public.tags t ON ptags.tag_id = t.tag_id
  WHERE 
    (search_query = '' OR 
     to_tsvector('english', p.title || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', search_query) OR
     to_tsvector('english', COALESCE(pt.content, '')) @@ plainto_tsquery('english', search_query))
    AND (cardinality(filter_tags) = 0 OR EXISTS (
      SELECT 1 FROM public.policy_tags ptags2 
      JOIN public.tags t2 ON ptags2.tag_id = t2.tag_id 
      WHERE ptags2.policy_id = p.id AND t2.tag_name = ANY(filter_tags)
    ))
    AND (filter_type = '' OR p.type = filter_type)
    AND (filter_status = '' OR p.status::text = filter_status)
  GROUP BY p.id, p.title, p.description, p.type, p.status, p.author, p.created_at, p.updated_at, pt.content
  ORDER BY 
    CASE WHEN search_query = '' THEN p.updated_at END DESC,
    CASE WHEN search_query != '' THEN rank END DESC;
END;
$function$;