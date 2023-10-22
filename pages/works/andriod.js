import {
  Container,
  Badge
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { Title } from '../../components/work'
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
