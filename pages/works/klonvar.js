import {
  Container,
  Badge,
  List,
  ListItem,
  Heading,
  Box,
  useColorModeValue
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Klonvar">
    <Container>
      <Title>
        Klonvar — Internship <Badge>2025-Present</Badge>
      </Title>

      <P>
        Building and maintaining a real estate web application as part of an ongoing
        internship. The role involves full-stack development, implementing design
        changes and feature requests from the client, and collaborating on a
        production codebase.
      </P>

      <Box
        p={4}
        my={4}
        borderRadius="md"
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="cyan.500"
      >
        <Heading as="h4" size="sm" mb={2}>Key Contributions</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Built client portal with messaging system</ListItem>
          <ListItem>• Implemented email notification system</ListItem>
          <ListItem>• Implementing design changes and feature requests</ListItem>
          <ListItem>• Maintaining production web application</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Role</Meta>
          <span>Software Development Intern</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Next.js, TypeScript, Prisma, Chakra UI</span>
        </ListItem>
        <ListItem>
          <Meta>Domain</Meta>
          <span>Real Estate</span>
        </ListItem>
        <ListItem>
          <Meta>Status</Meta>
          <span>Ongoing</span>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Technical Stack
      </Heading>

      <P>
        The application is built with Next.js and TypeScript for type-safe
        full-stack development, Prisma as the ORM for database management, and
        Chakra UI for the component library. This modern stack enables rapid
        feature development with strong type safety and a consistent design system.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Client Portal & Messaging
      </Heading>

      <P>
        Designed and implemented a client-facing portal with a built-in messaging
        system, allowing real estate clients to communicate directly through the
        platform. Integrated email notifications to ensure timely responses and
        keep all parties informed of updates.
      </P>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
