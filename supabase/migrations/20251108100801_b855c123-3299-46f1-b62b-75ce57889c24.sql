-- Fix security warnings - drop trigger first, then recreate function

DROP TRIGGER IF EXISTS policy_sections_search_vector_update ON policy_sections;

DROP FUNCTION IF EXISTS update_policy_section_search_vector();
CREATE OR REPLACE FUNCTION update_policy_section_search_vector()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.section_title, '') || ' ' || 
    COALESCE(NEW.section_content, '')
  );
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER policy_sections_search_vector_update
  BEFORE INSERT OR UPDATE OF section_title, section_content
  ON policy_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_policy_section_search_vector();