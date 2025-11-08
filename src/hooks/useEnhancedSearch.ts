import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface SearchResult {
  section_id: string;
  policy_id: string;
  section_title: string;
  section_content: string;
  rank?: number;
  similarity?: number;
}

export function useEnhancedSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const { toast } = useToast();

  /**
   * Keyword search using full-text search (TSVECTOR)
   */
  const searchKeyword = async (query: string, limit: number = 10) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .rpc('search_policy_sections_keyword', {
          search_query: query,
          match_count: limit
        });

      if (error) throw error;
      
      setResults(data || []);
      return data || [];
    } catch (error) {
      console.error('Keyword search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to perform keyword search",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Semantic search using vector similarity (pgvector)
   * Note: Requires embeddings to be generated for sections
   */
  const searchSemantic = async (
    queryEmbedding: number[],
    threshold: number = 0.7,
    limit: number = 10
  ) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .rpc('search_policy_sections_semantic', {
          query_embedding: JSON.stringify(queryEmbedding),
          match_threshold: threshold,
          match_count: limit
        });

      if (error) throw error;
      
      setResults(data || []);
      return data || [];
    } catch (error) {
      console.error('Semantic search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to perform semantic search",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Combined search: Uses keyword search and optionally enhances with semantic search
   */
  const searchCombined = async (query: string, limit: number = 10) => {
    // For now, use keyword search
    // In production, you could combine both approaches
    return searchKeyword(query, limit);
  };

  return {
    loading,
    results,
    searchKeyword,
    searchSemantic,
    searchCombined,
    setResults,
  };
}
