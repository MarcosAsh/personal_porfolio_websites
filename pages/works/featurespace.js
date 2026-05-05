import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Heading,
  Box,
  useColorModeValue
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Layout from '../../components/layouts/article'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Visa (Featurespace)">
    <Container>
      <Title>
        Visa (Featurespace) — Incoming Intern <Badge>2026</Badge>
      </Title>

      <P>
        Incoming software engineering intern at Featurespace, a Visa company.
        Featurespace builds adaptive behavioural analytics and real-time fraud
        and financial-crime prevention used by major banks and payment networks
        worldwide.
      </P>

      <Box
        p={4}
        my={4}
        borderRadius="md"
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="cyan.500"
      >
        <Heading as="h4" size="sm" mb={2}>About the Role</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Working on production systems used in real-time payments fraud prevention</ListItem>
          <ListItem>• Exposure to large-scale streaming data, machine learning, and low-latency infrastructure</ListItem>
          <ListItem>• Collaborating with engineering teams across the Visa / Featurespace organisation</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Role</Meta>
          <span>Software Engineering Intern (Incoming)</span>
        </ListItem>
        <ListItem>
          <Meta>Company</Meta>
          <Link href="https://www.featurespace.com" target="_blank">
            Featurespace, a Visa company <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Domain</Meta>
          <span>Real-time payments fraud and financial-crime prevention</span>
        </ListItem>
        <ListItem>
          <Meta>Status</Meta>
          <span>Incoming</span>
        </ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
