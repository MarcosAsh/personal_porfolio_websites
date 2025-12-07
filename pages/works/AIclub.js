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
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="AI Club Website">
    <Container>
      <Title>
        AI Club Website <Badge>2023</Badge>
      </Title>
      
      <P>
        A collaborative project to create an interactive website for the AI Club. 
        The site features a modern design with 3D elements and an integrated chatbot 
        powered by the OpenAI API.
      </P>

      <Box 
        p={4} 
        my={4} 
        borderRadius="md" 
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="blue.500"
      >
        <Heading as="h4" size="sm" mb={2}>Project Features</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} fontSize="sm">
          <Text>✓ Interactive 3D elements</Text>
          <Text>✓ AI-powered chatbot</Text>
          <Text>✓ Modern responsive design</Text>
          <Text>✓ Flask backend</Text>
        </SimpleGrid>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Web (Cross-platform)</span>
        </ListItem>
        <ListItem>
          <Meta>Frontend</Meta>
          <span>Vite, Three.js, HTML/CSS/JavaScript</span>
        </ListItem>
        <ListItem>
          <Meta>Backend</Meta>
          <span>Flask (Python)</span>
        </ListItem>
        <ListItem>
          <Meta>API</Meta>
          <span>OpenAI API</span>
        </ListItem>
        <ListItem>
          <Meta>GitHub</Meta>
          <Link href="https://github.com/MarcosAsh/AI_Club_2023.github.io" target="_blank">
            AI Club Repository <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Technical Implementation
      </Heading>
      
      <P>
        The frontend was built using Vite for fast development and optimized builds. 
        Three.js provides immersive 3D graphics and animations. The Flask backend 
        handles API requests to OpenAI for the chatbot functionality.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Collaboration
      </Heading>
      
      <P>
        This was a group project that provided valuable experience in collaborative 
        software development, version control with Git, and coordinating feature 
        development across team members.
      </P>

      <WorkImage src="/images/works/ai_club1.jpg" alt="AI Club Homepage" />
      <WorkImage src="/images/works/ai_club2.jpg" alt="AI Club Chatbot Interface" />
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
