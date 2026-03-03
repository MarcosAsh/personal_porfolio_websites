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
  <Layout title="Keras Contributions">
    <Container>
      <Title>
        Keras (Google) — Open Source <Badge>2025-2026</Badge>
      </Title>

      <P>
        15+ merged pull requests to Keras, Google&apos;s deep learning framework.
        Contributions span new layer implementations, image processing operations,
        performance optimisations, and test coverage improvements across the
        PyTorch, JAX, and MLX backends.
      </P>

      <Box
        p={4}
        my={4}
        borderRadius="md"
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="cyan.500"
      >
        <Heading as="h4" size="sm" mb={2}>Highlights</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Implemented GRU and LSTM layers for the PyTorch and MLX backends</ListItem>
          <ListItem>• Added SSIM (Structural Similarity Index) to keras.ops.image</ListItem>
          <ListItem>• Added euclidean distance transform to keras.ops.image</ListItem>
          <ListItem>• Added higher-order B-spline interpolation (orders 2-5) to map_coordinates</ListItem>
          <ListItem>• Refactored ExtractPatches to handle both 2D and 3D</ListItem>
          <ListItem>• Reduced memory usage in sparse_categorical_crossentropy</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Repository</Meta>
          <Link href="https://github.com/keras-team/keras" target="_blank">
            keras-team/keras <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>PRs</Meta>
          <span>15+ merged</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Python, TensorFlow, PyTorch, JAX, MLX</span>
        </ListItem>
        <ListItem>
          <Meta>Areas</Meta>
          <span>RNN layers, image ops, numerical methods, testing</span>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        New Features
      </Heading>

      <P>
        Implemented GRU and LSTM recurrent layers for the PyTorch and MLX backends,
        enabling these core RNN building blocks on additional hardware targets. Added
        SSIM and euclidean distance transform operations to keras.ops.image, expanding
        the framework&apos;s image processing toolkit. Implemented higher-order B-spline
        interpolation (orders 2-5) for map_coordinates, providing smoother interpolation
        for image resampling tasks.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Refactors & Bug Fixes
      </Heading>

      <P>
        Refactored ExtractPatches to handle both 2D and 3D inputs in a unified
        implementation. Reduced memory usage in sparse_categorical_crossentropy by
        avoiding unnecessary one-hot expansion. Fixed dynamic shape handling in
        CenterCrop and the torch backend. Fixed a mask error in ReversibleEmbedding
        when used with reverse=True.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Testing
      </Heading>

      <P>
        Increased test coverage for TextVectorization, IntegerLookup, and StringLookup
        preprocessing layers, improving the reliability of Keras&apos;s text and
        categorical feature processing pipeline.
      </P>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
