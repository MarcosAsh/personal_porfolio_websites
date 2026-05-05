import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Heading,
  Box,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const PRItem = ({ number, title, repo = 'keras' }) => (
  <ListItem mb={1}>
    <Link
      href={`https://github.com/keras-team/${repo}/pull/${number}`}
      target="_blank"
      fontWeight="medium"
    >
      #{number}
    </Link>{' '}
    <Text as="span" fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')}>
      {title}
    </Text>
  </ListItem>
)

const Work = () => (
  <Layout title="Keras Contributions">
    <Container>
      <Title>
        Keras (Google) — Open Source <Badge>2026</Badge>
      </Title>

      <P>
        32 merged pull requests to Keras, Google&apos;s deep learning framework,
        plus additional merged work in Keras Kinetic. Contributions span new
        ops and layer implementations, cuDNN-backed RNN paths for the JAX and
        PyTorch backends, ONNX export improvements, performance work, and a
        long tail of correctness and shape-handling fixes.
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
          <ListItem>• Implemented GRU and LSTM for the PyTorch and JAX backends, including a cuDNN LSTM path and a fused JAX Bidirectional LSTM cuDNN call</ListItem>
          <ListItem>• Added new public ops: keras.ops.matrix_rank, keras.ops.pinv, keras.ops.numpy.geomspace, keras.ops.nn.fold</ListItem>
          <ListItem>• Added a CTC beam search decoder for the torch backend</ListItem>
          <ListItem>• ONNX export improvements: dict/list inputs for torch export, jax2onnx for direct JAX-to-ONNX export</ListItem>
          <ListItem>• Performance work in tree.flatten, tree.map_structure, channels_last torch convs, sparse_categorical_crossentropy memory use</ListItem>
          <ListItem>• Fixed long-standing correctness bugs in Attention, GroupQueryAttention, ReversibleEmbedding, Softmax with masks, model.summary, and add_loss under JAX JIT</ListItem>
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
          <span>32 merged in keras-team/keras (plus more in keras-team/kinetic)</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Python, TensorFlow, PyTorch, JAX</span>
        </ListItem>
        <ListItem>
          <Meta>Areas</Meta>
          <span>RNN layers, ops, ONNX export, performance, correctness</span>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        RNN backends and cuDNN
      </Heading>

      <P>
        A significant strand of the work brought cuDNN-backed RNN paths to the
        JAX backend and rewired the PyTorch path:
      </P>

      <List ml={2} my={3}>
        <PRItem number={22791} title="Fuse JAX Bidirectional LSTM into a single cuDNN call" />
        <PRItem number={22470} title="Rewrite torch LSTM to use functional API with CPU fallback" />
        <PRItem number={22401} title="Add optimized GRU for JAX backend" />
        <PRItem number={22399} title="Add cuDNN LSTM for JAX backend" />
        <PRItem number={22115} title="Implement GRU for PyTorch backend" />
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        New ops and features
      </Heading>

      <List ml={2} my={3}>
        <PRItem number={22799} title="Add CTC beam search decoder for torch backend" />
        <PRItem number={22772} title="Add keras.ops.matrix_rank" />
        <PRItem number={22763} title="Add keras.ops.pinv" />
        <PRItem number={22283} title="Add fold to keras.ops.nn" />
        <PRItem number={22257} title="Add geomspace to keras.ops.numpy" />
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        ONNX export
      </Heading>

      <List ml={2} my={3}>
        <PRItem number={22737} title="Support dict/list inputs in torch ONNX export" />
        <PRItem number={22443} title="Use jax2onnx for direct JAX-to-ONNX export" />
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Performance
      </Heading>

      <List ml={2} my={3}>
        <PRItem number={22770} title="Optimize common cases for tree.flatten and tree.map_structure" />
        <PRItem number={22674} title="Skip tree.flatten in any_symbolic_tensors for non-nested args" />
        <PRItem number={22324} title="Use channels_last memory format for torch conv ops" />
        <PRItem number={22169} title="Reduce memory usage in sparse_categorical_crossentropy" />
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Correctness and bug fixes
      </Heading>

      <List ml={2} my={3}>
        <PRItem number={22808} title="Fix torch lstsq with rcond, re-enable test" />
        <PRItem number={22738} title="Fix stale return_attention_scores flag in Attention.compute_output_spec" />
        <PRItem number={22661} title="Pass Python strings to TextVectorization standardize on non-TF backends" />
        <PRItem number={22642} title="Fix symbolic output shape in GroupQueryAttention" />
        <PRItem number={22505} title="Fix KeyError in model.summary() when a layer returns a dict" />
        <PRItem number={22395} title="Fix TracerBoolConversionError when using add_loss with JAX JIT" />
        <PRItem number={22379} title="Fix Softmax OOM when using mask on torch backend" />
        <PRItem number={21961} title="Fix ReversibleEmbedding mask error when using reverse=True" />
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Shape handling and validation
      </Heading>

      <List ml={2} my={3}>
        <PRItem number={22676} title="Validate DepthwiseConv output shape in build()" />
        <PRItem number={22662} title="Validate SeparableConv output shape in build()" />
        <PRItem number={22280} title="Use canonicalize_axis in Linspace and Logspace compute_output_spec" />
        <PRItem number={22041} title="Torch dynamic shapes" />
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Refactors
      </Heading>

      <List ml={2} my={3}>
        <PRItem number={22013} title="Refactor ExtractPatches to handle both 2D and 3D" />
        <PRItem number={21980} title="Unify extract_patches to support both 2D and 3D patches" />
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Test coverage
      </Heading>

      <List ml={2} my={3}>
        <PRItem number={22066} title="Increase test coverage for TextVectorization layer" />
        <PRItem number={22022} title="Increase test coverage for IntegerLookup layer" />
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
