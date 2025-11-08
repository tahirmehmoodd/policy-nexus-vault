-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to policy_sections for semantic search
ALTER TABLE policy_sections 
ADD COLUMN IF NOT EXISTS embedding vector(384);

-- Add full-text search column to policy_sections
ALTER TABLE policy_sections
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS policy_sections_search_idx ON policy_sections USING GIN(search_vector);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS policy_sections_embedding_idx ON policy_sections USING ivfflat(embedding vector_cosine_ops);

-- Add reviewer and owner to policies table
ALTER TABLE policies
ADD COLUMN IF NOT EXISTS reviewer_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id);

-- Update the search_vector automatically when section content changes
CREATE OR REPLACE FUNCTION update_policy_section_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.section_title, '') || ' ' || 
    COALESCE(NEW.section_content, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic search vector updates
DROP TRIGGER IF EXISTS policy_sections_search_vector_update ON policy_sections;
CREATE TRIGGER policy_sections_search_vector_update
  BEFORE INSERT OR UPDATE OF section_title, section_content
  ON policy_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_policy_section_search_vector();

-- Function for semantic search on policy sections
CREATE OR REPLACE FUNCTION search_policy_sections_semantic(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  section_id uuid,
  policy_id uuid,
  section_title text,
  section_content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ps.section_id,
    ps.policy_id,
    ps.section_title,
    ps.section_content,
    1 - (ps.embedding <=> query_embedding) as similarity
  FROM policy_sections ps
  WHERE ps.embedding IS NOT NULL
    AND 1 - (ps.embedding <=> query_embedding) > match_threshold
  ORDER BY ps.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function for keyword search on policy sections
CREATE OR REPLACE FUNCTION search_policy_sections_keyword(
  search_query text,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  section_id uuid,
  policy_id uuid,
  section_title text,
  section_content text,
  rank real
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ps.section_id,
    ps.policy_id,
    ps.section_title,
    ps.section_content,
    ts_rank(ps.search_vector, plainto_tsquery('english', search_query)) as rank
  FROM policy_sections ps
  WHERE ps.search_vector @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC
  LIMIT match_count;
END;
$$;

-- Enable realtime for policy_sections
ALTER TABLE policy_sections REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE policy_sections;