import { Box, Flex, Text } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box bg="blue.500" color="white" px={4} py={2}>
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">Postboard</Text>
      </Flex>
    </Box>
  );
};

export default Navbar;