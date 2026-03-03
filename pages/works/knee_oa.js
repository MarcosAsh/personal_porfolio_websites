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
  <Layout title="Knee OA Grading">
    <Container>
      <Title>
        Automated Knee Osteoarthritis Grading <Badge>2026</Badge>
      </Title>

      <P>
        Investigated deep learning approaches for classifying knee osteoarthritis
        severity from X-ray images using the Kellgren-Lawrence (KL) grading scale.
        Evaluated seven architectures and built a weighted ensemble of the top
        performers.
      </P>

      <Box
        p={4}
        my={4}
        borderRadius="md"
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="cyan.500"
      >
        <Heading as="h4" size="sm" mb={2}>Key Results</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Xception achieved best performance: 71.7% accuracy, 0.69 F1, 0.64 Cohen&apos;s Kappa</ListItem>
          <ListItem>• Evaluated 7 architectures including baseline CNN and 5 pretrained models</ListItem>
          <ListItem>• Built weighted ensemble of top 3 models</ListItem>
          <ListItem>• Thorough failure analysis identifying model collapse and confusion patterns</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Type</Meta>
          <span>AI Coursework</span>
        </ListItem>
        <ListItem>
          <Meta>Date</Meta>
          <span>February 2026</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Python, TensorFlow/Keras, Transfer Learning</span>
        </ListItem>
        <ListItem>
          <Meta>Dataset</Meta>
          <span>352 knee X-ray images (KL grading scale)</span>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Architectures Evaluated
      </Heading>

      <List ml={6} my={2} spacing={1}>
        <ListItem>• <strong>Baseline CNN:</strong> Custom convolutional architecture</ListItem>
        <ListItem>• <strong>Attention CNN:</strong> Squeeze-and-Excitation + spatial attention modules</ListItem>
        <ListItem>• <strong>VGG16:</strong> Pretrained on ImageNet with fine-tuning</ListItem>
        <ListItem>• <strong>ResNet50:</strong> Deep residual network</ListItem>
        <ListItem>• <strong>DenseNet121:</strong> Dense connectivity pattern</ListItem>
        <ListItem>• <strong>EfficientNetB0:</strong> Compound-scaled architecture</ListItem>
        <ListItem>• <strong>Xception:</strong> Depthwise separable convolutions (best performer)</ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Failure Analysis
      </Heading>

      <P>
        Conducted thorough failure analysis identifying model collapse in
        ResNet50 and EfficientNetB0 (both defaulted to predicting dominant classes),
        and adjacent-grade confusion patterns where models struggled to distinguish
        between neighbouring KL grades. Addressed challenges including class
        imbalance, small dataset size (352 images), and subtle inter-grade
        visual differences.
      </P>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
