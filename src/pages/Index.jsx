import { useState } from "react";
import { Container, VStack, Box, Text, Input, Button, HStack, IconButton, Flex } from "@chakra-ui/react";
import { FaThumbsUp, FaThumbsDown, FaLaugh, FaSadCry } from "react-icons/fa";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const addPost = () => {
    if (newPost.trim() !== "") {
      setPosts([...posts, { text: newPost, reactions: { like: 0, dislike: 0, laugh: 0, sad: 0 } }]);
      setNewPost("");
    }
  };

  const addReaction = (index, reaction) => {
    const updatedPosts = [...posts];
    updatedPosts[index].reactions[reaction]++;
    setPosts(updatedPosts);
  };

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
            <Button colorScheme="blue" onClick={addPost}>Post</Button>
          </VStack>
        </Box>
        {posts.map((post, index) => (
          <Box key={index} w="100%" p={4} bg="white" borderRadius="md" boxShadow="md">
            <Text mb={4}>{post.text}</Text>
            <HStack spacing={4}>
              <IconButton
                aria-label="Like"
                icon={<FaThumbsUp />}
                onClick={() => addReaction(index, "like")}
              />
              <Text>{post.reactions.like}</Text>
              <IconButton
                aria-label="Dislike"
                icon={<FaThumbsDown />}
                onClick={() => addReaction(index, "dislike")}
              />
              <Text>{post.reactions.dislike}</Text>
              <IconButton
                aria-label="Laugh"
                icon={<FaLaugh />}
                onClick={() => addReaction(index, "laugh")}
              />
              <Text>{post.reactions.laugh}</Text>
              <IconButton
                aria-label="Sad"
                icon={<FaSadCry />}
                onClick={() => addReaction(index, "sad")}
              />
              <Text>{post.reactions.sad}</Text>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;