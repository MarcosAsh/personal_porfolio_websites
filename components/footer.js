import { Box, Text, Link, useColorModeValue } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box 
      align="center" 
      opacity={0.7} 
      fontSize="sm"
      py={4}
      mt={8}
      borderTop="1px solid"
      borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
    >
      <Text>
        &copy; {new Date().getFullYear()} Marcos Ashton Iglesias. All Rights Reserved.
      </Text>
      <Text fontSize="xs" mt={1} opacity={0.7}>
        Built with{' '}
        <Link href="https://nextjs.org/" target="_blank" color="cyan.500">
          Next.js
        </Link>
        {' '}&{' '}
        <Link href="https://chakra-ui.com/" target="_blank" color="cyan.500">
          Chakra UI
        </Link>
      </Text>
    </Box>
  )
}

export default Footer
