import { useState, useEffect } from "react";
import { Container, VStack, Box, Text, Input, Button, HStack, IconButton, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { usePosts, useAddPost, useAddReaction } from '../api/supabase';
import { FaThumbsUp, FaThumbsDown, FaLaugh, FaSadCry } from "react-icons/fa";
import { supabase } from '../api/supabase';

const Index = () => {
  const { data: posts, isLoading: postsLoading, isError: postsError } = usePosts();
  const addPostMutation = useAddPost();
  const addReactionMutation = useAddReaction();
  const [newPost, setNewPost] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || 'anonymous');
    };
    fetchUser();
  }, []);

  const addPost = () => {
    if (newPost.trim() !== "") {
      addPostMutation.mutate({ title: newPost, body: newPost, author_id: userId });
      setNewPost("");
    }
  };

  const addReaction = (postId, emoji) => {
    addReactionMutation.mutate({ post_id: postId, user_id: userId, emoji });
  };

  if (postsLoading) return <Spinner />;
  if (postsError) return <Alert status="error"><AlertIcon />Error loading posts</Alert>;

  return (
    <Container centerContent maxW="container.md" py={4}>
      <VStack spacing={4} w="100%">
        <Box w="100%" p={4} bg="blue.500" color="white" borderRadius="md" textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">Public Postboard</Text>
        </Box>
        <Box w="100%" p={4} bg="gray.100" borderRadius="md">
          <VStack spacing={4}>
            <Input
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <Button colorScheme="blue" onClick={addPost} isLoading={addPostMutation.isLoading}>Post</Button>
          </VStack>
        </Box>
        {posts.map((post) => (
          <Box key={post.id} w="100%" p={4} bg="white" borderRadius="md" boxShadow="md">
            <Text mb={4}>{post.body}</Text>
            <HStack spacing={4}>
              <IconButton
                aria-label="Like"
                icon={<FaThumbsUp />}
                onClick={() => addReaction(post.id, "👍")}
              />
              <Text>{post.reactions?.filter(r => r.emoji === "👍").length || 0}</Text>
              <IconButton
                aria-label="Dislike"
                icon={<FaThumbsDown />}
                onClick={() => addReaction(post.id, "👎")}
              />
              <Text>{post.reactions?.filter(r => r.emoji === "👎").length || 0}</Text>
              <IconButton
                aria-label="Laugh"
                icon={<FaLaugh />}
                onClick={() => addReaction(post.id, "😂")}
              />
              <Text>{post.reactions?.filter(r => r.emoji === "😂").length || 0}</Text>
              <IconButton
                aria-label="Sad"
                icon={<FaSadCry />}
                onClick={() => addReaction(post.id, "😢")}
              />
              <Text>{post.reactions?.filter(r => r.emoji === "😢").length || 0}</Text>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;