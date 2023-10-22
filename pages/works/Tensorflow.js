import {
  Container,
  Badge,
  Link,
  List,
  ListItem
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="tensorflow">
    <Container>
      <Title>
        Tensorflow <Badge>2022</Badge>
      </Title>
      <P>
        This is an asorted scripts that follow the course by freeCodeCamp.org. It includes:
        Building Neural Networks with TensorFlow, Building Convolutional Neural Networks with TensorFlow,
        Building More Advanced Models in Teno Convolutional Neural Networks with TensorFlow,
        Evaluating Classification Models, MLOps with Weights and Biases, Modern Convolutional Neural Networks
        and Model Deployment.     
      </P>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Windows/macOS/Linux/iOS/Android</span>
        </ListItem>
        <ListItem>
          <Meta>Tutorial</Meta>
          <Link href="https://www.youtube.com/watch?v=IA3WxTTPXqQ&t=87542s&ab_channel=freeCodeCamp.org">
            Free Code Camp{' '}
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>GitHub</Meta>
          <Link href="https://github.com/MarcosAsh/Deep_Learning_for_Computer_Vision">
            Github{' '}
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Python, google colab and </span>
        </ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
