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
  <Layout title="Saddle">
    <Container>
      <Title>
        Saddle <Badge>2025</Badge>
      </Title>

      <P>
        Interactive optimiser visualiser implementing six optimisers across five loss
        surfaces. Includes a cross-language benchmark layer comparing Adam step performance
        in C, JAX, WebAssembly, and JavaScript.
      </P>

      <Box
        p={4}
        my={4}
        borderRadius="md"
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="cyan.500"
      >
        <Heading as="h4" size="sm" mb={2}>Key Finding</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>
            WASM was expected to win in the browser; JavaScript did.
          </ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Live Demo</Meta>
          <Link href="https://saddle-fawn.vercel.app" isExternal>
            saddle-fawn.vercel.app <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Source</Meta>
          <Link href="https://github.com/MarcosAsh/Saddle" isExternal>
            MarcosAsh/Saddle <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>C, JAX, WebAssembly, JavaScript</span>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Technical Details
      </Heading>

      <P>
        The visualiser renders real-time 3D loss surfaces using Plotly.js and animates
        six optimisation algorithms simultaneously: SGD, Adam, AdaHessian, RMSprop,
        L-BFGS, and a native C implementation of Adam compiled to WebAssembly. Users
        can switch between five canonical loss surfaces and tune hyperparameters through
        an interactive control panel.
      </P>

      <P>
        The benchmark layer measures wall-clock time for each optimiser step across
        four language targets, revealing that JavaScript V8 JIT compilation outperforms
        the WebAssembly runtime for this workload profile.
      </P>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
