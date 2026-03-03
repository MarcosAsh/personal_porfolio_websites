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
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Layout from '../../components/layouts/article'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="LLMs Unlocked">
    <Container>
      <Title>
        LLMs Unlocked <Badge>2025-2026</Badge>
      </Title>

      <P>
        A from-scratch LLM framework written in ~50,000 lines of C++. The project
        implements a complete deep learning stack — from a custom automatic
        differentiation engine through transformer building blocks to a BPE tokenizer
        and training infrastructure — without relying on external ML libraries.
      </P>

      <Box
        p={4}
        my={4}
        borderRadius="md"
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="cyan.500"
      >
        <Heading as="h4" size="sm" mb={2}>Key Features</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Custom autodiff engine with reverse-mode backpropagation</ListItem>
          <ListItem>• Transformer blocks with multi-head attention</ListItem>
          <ListItem>• BPE tokenizer implementation</ListItem>
          <ListItem>• Training infrastructure with optimisers and schedulers</ListItem>
          <ListItem>• Visual graph editor for neural network module visualisation</ListItem>
          <ListItem>• LLaMA-style architecture (RoPE, GQA, RMSNorm, SwiGLU FFN)</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Language</Meta>
          <span>C++ (~50,000 lines)</span>
        </ListItem>
        <ListItem>
          <Meta>Architecture</Meta>
          <span>LLaMA-style transformer</span>
        </ListItem>
        <ListItem>
          <Meta>Components</Meta>
          <span>Autodiff, Transformer, Tokenizer, Training Loop</span>
        </ListItem>
        <ListItem>
          <Meta>Live Demo</Meta>
          <Link href="https://frontend-marcosashs-projects.vercel.app/" isExternal>
            frontend-marcosashs-projects.vercel.app <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Automatic Differentiation Engine
      </Heading>

      <P>
        The core of the framework is a custom autodiff engine that constructs a
        computational graph at runtime and performs reverse-mode differentiation to
        compute gradients. This enables training of arbitrary neural network
        architectures using standard gradient-based optimisation.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Transformer Architecture
      </Heading>

      <P>
        Implements a LLaMA-style decoder-only transformer with Rotary Position
        Embeddings (RoPE), Grouped-Query Attention (GQA), RMSNorm, and SwiGLU
        feed-forward networks. The modular design allows individual components to
        be swapped and experimented with.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Visual Graph Editor
      </Heading>

      <P>
        Includes a visual graph editor for inspecting and visualising neural network
        modules, inspired by bbycroft.net/llm. This tool allows interactive
        exploration of the model architecture, making it easier to understand
        data flow and debug network configurations.
      </P>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
