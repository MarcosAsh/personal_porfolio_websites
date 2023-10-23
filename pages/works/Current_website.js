import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="About this website">
    <Container>
      <Title>
        This website <Badge>Summer 2023</Badge>
      </Title>
      <P>
        This website is produced by me and is personal my portfolio.
      </P>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Windows/macOS/Linux/iOS/Android</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Next.js, Chakra UI, Three.js and Framer Motion</span>
        </ListItem>
        <ListItem>
          <Meta>Deployed by</Meta>
          <Link href="https://www.netlify.com/">
            netfily
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Source code</Meta>
          <Link href="https://github.com/MarcosAsh/personal_porfolio_websites">
            The github repository<ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
