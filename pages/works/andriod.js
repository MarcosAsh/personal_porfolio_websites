import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  SimpleGrid
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="andriod">
    <Container>
      <Title>
        Andriod <Badge>2023</Badge>
      </Title>
      <P>To be made. Please look at this part of the site later. </P>
      
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
