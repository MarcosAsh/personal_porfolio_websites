import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Heading,
  Box,
  useColorModeValue,
  SimpleGrid,
  Text
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Personal Portfolio Website">
    <Container>
      <Title>
        Personal Portfolio Website <Badge>2023 - Present</Badge>
      </Title>
      
      <P>
        A modern, responsive personal portfolio website built to showcase my technical 
        projects, professional experience, and skills. The site features an engaging 3D 
        animated header, smooth page transitions, and a clean, professional design.
      </P>

      <Box 
        p={4} 
        my={4} 
        borderRadius="md" 
        bg={useColorModeValue('cyan.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="cyan.500"
      >
        <Heading as="h4" size="sm" mb={2}>Key Features</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} fontSize="sm">
          <Text>✓ 3D animations with Three.js</Text>
          <Text>✓ Dark/Light theme toggle</Text>
          <Text>✓ Fully responsive design</Text>
          <Text>✓ Server-side rendering</Text>
          <Text>✓ SEO optimized</Text>
          <Text>✓ Fast page transitions</Text>
        </SimpleGrid>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Next.js, React, Chakra UI, Three.js, Framer Motion</span>
        </ListItem>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Web (Cross-platform)</span>
        </ListItem>
        <ListItem>
          <Meta>Hosting</Meta>
          <Link href="https://www.netlify.com/" target="_blank">
            Netlify <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Live Site</Meta>
          <Link href="https://marcos-ashton-personal-portfolio.netlify.app/" target="_blank">
            marcos-ashton-personal-portfolio.netlify.app <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Source</Meta>
          <Link href="https://github.com/MarcosAsh/personal_porfolio_websites" target="_blank">
            GitHub Repository <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Technical Implementation
      </Heading>
      
      <P>
        The website is built using Next.js for optimal performance with server-side 
        rendering and automatic code splitting. Chakra UI provides the component library 
        with built-in accessibility and responsive design. Three.js powers the interactive 
        3D computer model in the header.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Architecture Highlights
      </Heading>
      
      <List ml={6} my={2} spacing={2}>
        <ListItem>
          <strong>Next.js:</strong> Server-side rendering for SEO and fast initial page loads
        </ListItem>
        <ListItem>
          <strong>Chakra UI:</strong> Accessible component library with theming support
        </ListItem>
        <ListItem>
          <strong>Three.js:</strong> WebGL-based 3D graphics with GLTF model loading
        </ListItem>
        <ListItem>
          <strong>Framer Motion:</strong> Smooth page transitions and micro-interactions
        </ListItem>
        <ListItem>
          <strong>Responsive Design:</strong> Mobile-first approach with breakpoint-based layouts
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Performance Optimizations
      </Heading>
      
      <List ml={6} my={2} spacing={1}>
        <ListItem>• Lazy loading of 3D components</ListItem>
        <ListItem>• Image optimization with Next.js Image component</ListItem>
        <ListItem>• Code splitting for smaller bundle sizes</ListItem>
        <ListItem>• Cookie-based color mode persistence</ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
