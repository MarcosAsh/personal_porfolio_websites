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
  <Layout title="AD Literature Review">
    <Container>
      <Title>
        Automatic Differentiation in Modern ML Frameworks <Badge>2026</Badge>
      </Title>

      <P>
        A literature review examining automatic differentiation (AD) theory and
        its implementation across modern machine learning frameworks, covering
        the design trade-offs between TensorFlow, PyTorch, and JAX.
      </P>

      <Box
        p={4}
        my={4}
        borderRadius="md"
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="cyan.500"
      >
        <Heading as="h4" size="sm" mb={2}>Topics Covered</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Forward mode and reverse mode AD theory</ListItem>
          <ListItem>• Connection between reverse-mode AD and backpropagation</ListItem>
          <ListItem>• Framework design trade-offs (TensorFlow, PyTorch, JAX)</ListItem>
          <ListItem>• Compilation-based AD (XLA, TorchInductor, AOT Autograd)</ListItem>
          <ListItem>• Emerging directions: forward gradients, neural ODEs, SSA-form AD</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Type</Meta>
          <span>Literature Review</span>
        </ListItem>
        <ListItem>
          <Meta>Year</Meta>
          <span>2026</span>
        </ListItem>
        <ListItem>
          <Meta>Scope</Meta>
          <span>AD Theory, Framework Design, Compilation</span>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Framework Analysis
      </Heading>

      <List ml={6} my={2} spacing={1}>
        <ListItem>• <strong>TensorFlow:</strong> Static computation graphs, XLA compilation, tf.function tracing</ListItem>
        <ListItem>• <strong>PyTorch:</strong> Dynamic define-by-run graphs, TorchInductor/AOT Autograd compilation</ListItem>
        <ListItem>• <strong>JAX:</strong> Functional composable transformations (grad, jit, vmap, pmap)</ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Advanced Topics
      </Heading>

      <P>
        Explored differentiating through control flow and loops, efficient AD
        for linear algebra operations, and compilation-based approaches that
        fuse operations for better hardware utilisation. Discussed emerging
        research directions including forward gradients (Baydin et al.), neural
        ODEs (Chen et al.), and SSA-form differentiation for compiler-level AD.
      </P>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
