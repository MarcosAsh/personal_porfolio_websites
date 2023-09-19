import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  UnorderedList,
  Heading,
  Center
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Aiclub">
    <Container>
      <Title>
        AI club <Badge>2023</Badge>
      </Title>
      <P>
        This is the website I made for the AI club in the end of 2023. This was a group project
        for more information look at the GitHub.
      </P>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Windows/macOS/Linux/iOS/Android</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Vite, Three.js, openi api and flask  </span>
        </ListItem>
        <ListItem>
          <Meta>Github</Meta>
          <Link href="https://github.com/MarcosAsh/AI_Club_2023.github.io">
            Github{' '}
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>
      

      <WorkImage src="/images/works/ai_club1.jpg" alt="aiclub" />
      <WorkImage src="/images/works/ai_club2.jpg" alt="aiclub" />
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
