import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const enableAnonymousSignIn = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    if (!session) {
        const { error: signInError } = await supabase.auth.signInWithOtp({ email: 'anonymous@domain.com' });
        if (signInError) throw new Error(signInError.message);
    }
};

useEffect(() => {
    enableAnonymousSignIn();
}, []);

// Helper function to handle Supabase queries
const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

// Fetch posts
export const usePosts = () => useQuery({
    queryKey: ['posts'],
    queryFn: () => fromSupabase(supabase.from('posts').select('*')),
});

// Add a new post
export const useAddPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newPost) => fromSupabase(supabase.from('posts').insert([{ title: newPost.title, body: newPost.body, author_id: newPost.author_id }])),
        onSuccess: () => {
            queryClient.invalidateQueries('posts');
        },
    });
};

// Fetch reactions
export const useReactions = (postId) => useQuery({
    queryKey: ['reactions', postId],
    queryFn: () => fromSupabase(supabase.from('reactions').select('*').eq('post_id', postId)),
});

// Add a reaction
export const useAddReaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newReaction) => fromSupabase(supabase.from('reactions').insert([{ post_id: newReaction.post_id, user_id: newReaction.user_id, emoji: newReaction.emoji }])),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['reactions', variables.post_id]);
        },
    });
};