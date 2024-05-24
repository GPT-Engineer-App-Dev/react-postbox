import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to handle Supabase queries
const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

// Fetch all posts
export const usePosts = () => useQuery({
  queryKey: ['posts'],
  queryFn: () => fromSupabase(supabase.from('posts').select('*')),
});

// Add a new post
export const useAddPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPost) => fromSupabase(supabase.from('posts').insert([newPost])),
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });
};

// Fetch all reactions for a post
export const useReactions = (postId) => useQuery({
  queryKey: ['reactions', postId],
  queryFn: () => fromSupabase(supabase.from('reactions').select('*').eq('post_id', postId)),
});

// Add a reaction to a post
export const useAddReaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newReaction) => fromSupabase(supabase.from('reactions').insert([newReaction])),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['reactions', variables.post_id]);
    },
  });
};

/**
 * Types and Relations:
 * 
 * Posts:
 * - id: integer (Primary Key)
 * - title: text
 * - body: text
 * - created_at: timestamp with time zone (default: CURRENT_TIMESTAMP)
 * - author_id: uuid
 * 
 * Reactions:
 * - id: integer (Primary Key)
 * - post_id: integer (Foreign Key to posts.id)
 * - user_id: uuid
 * - emoji: character (maxLength: 2)
 */