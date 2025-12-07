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
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="TensorFlow Projects">
    <Container>
      <Title>
        TensorFlow Deep Learning Projects <Badge>2022 - Present</Badge>
      </Title>
      
      <P>
        A comprehensive collection of deep learning and computer vision projects 
        developed while completing the freeCodeCamp TensorFlow course. These projects 
        cover a wide range of machine learning techniques and deployment strategies.
      </P>

      <Box 
        p={4} 
        my={4} 
        borderRadius="md" 
        bg={useColorModeValue('orange.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="orange.500"
      >
        <Heading as="h4" size="sm" mb={2}>Topics Covered</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Building Neural Networks with TensorFlow</ListItem>
          <ListItem>• Convolutional Neural Networks (CNNs)</ListItem>
          <ListItem>• Advanced CNN Architectures</ListItem>
          <ListItem>• Classification Model Evaluation</ListItem>
          <ListItem>• MLOps with Weights and Biases</ListItem>
          <ListItem>• Modern CNN Architectures (ResNet, EfficientNet)</ListItem>
          <ListItem>• Model Deployment Strategies</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Google Colab, Local Development</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Python, TensorFlow, Keras, NumPy, Matplotlib</span>
        </ListItem>
        <ListItem>
          <Meta>Course</Meta>
          <Link href="https://www.youtube.com/watch?v=IA3WxTTPXqQ" target="_blank">
            freeCodeCamp TensorFlow Course <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>GitHub</Meta>
          <Link href="https://github.com/MarcosAsh/Deep_Learning_for_Computer_Vision" target="_blank">
            Deep Learning Repository <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Key Projects
      </Heading>

      <List ml={6} my={2} spacing={2}>
        <ListItem>
          <strong>Image Classification:</strong> Built and trained CNNs for multi-class 
          image classification tasks
        </ListItem>
        <ListItem>
          <strong>Transfer Learning:</strong> Fine-tuned pre-trained models (ResNet, 
          VGG, EfficientNet) for custom datasets
        </ListItem>
        <ListItem>
          <strong>Object Detection:</strong> Implemented detection pipelines using 
          modern architectures
        </ListItem>
        <ListItem>
          <strong>Model Deployment:</strong> Deployed models using TensorFlow Serving 
          and TensorFlow Lite for mobile
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Skills Developed
      </Heading>
      
      <P>
        Through these projects, I gained hands-on experience with the complete ML 
        pipeline: data preprocessing, model architecture design, training optimization, 
        evaluation metrics, and production deployment. I also learned to use MLOps 
        tools like Weights and Biases for experiment tracking.
      </P>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
