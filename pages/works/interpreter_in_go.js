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
  <Layout title="Interpreter in Go">
    <Container>
      <Title>
        Interpreter in Go <Badge>2024-2025</Badge>
      </Title>

      <P>
        A scripting language built from scratch in Go, designed to take the good
        parts of Perl — text processing, regex, pragmatism — while leaving behind
        the bad: line noise, TMTOWTDI, and cryptic sigils.
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
          <ListItem>• Custom lexer and parser</ListItem>
          <ListItem>• Tree-walking interpreter</ListItem>
          <ListItem>• Text processing and regex support</ListItem>
          <ListItem>• Clean, readable syntax inspired by modern scripting languages</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Source</Meta>
          <Link href="https://github.com/MarcosAsh/interpreter_in_go" target="_blank">
            GitHub <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Language</Meta>
          <span>Go</span>
        </ListItem>
        <ListItem>
          <Meta>Topics</Meta>
          <span>Interpreters, Compilers, Language Design</span>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Implementation
      </Heading>

      <P>
        The interpreter implements a full pipeline from source code to execution:
        lexical analysis tokenizes the input, a recursive descent parser builds an
        AST, and a tree-walking evaluator executes the program. The language supports
        text processing primitives and regex as first-class features, making it
        practical for scripting and automation tasks.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Design Philosophy
      </Heading>

      <P>
        The language prioritises readability and pragmatism over cleverness. Drawing
        inspiration from Perl&apos;s strengths in text manipulation while adopting a
        cleaner syntax, it aims to be a practical tool for everyday scripting without
        the steep learning curve of traditional text-processing languages.
      </P>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
