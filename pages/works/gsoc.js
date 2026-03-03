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
  <Layout title="Google Summer of Code 2026">
    <Container>
      <Title>
        Google Summer of Code 2026 <Badge>2026</Badge>
      </Title>

      <P>
        Applying to Google Summer of Code 2026 with two organisations: FFmpeg
        (Improving FATE Test Coverage) and the Rust Foundation
        (cargo-semver-checks type-checking lints). Actively contributing to
        both projects as part of the application process.
      </P>

      <Box
        p={4}
        my={4}
        borderRadius="md"
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="yellow.500"
      >
        <Heading as="h4" size="sm" mb={2}>FFmpeg — Improving FATE Test Coverage</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Submitted qualification patches via code.ffmpeg.org</ListItem>
          <ListItem>• Goal: expand the FATE continuous integration test suite</ListItem>
          <ListItem>• Working with C and the FFmpeg testing infrastructure</ListItem>
        </List>
      </Box>

      <Box
        p={4}
        my={4}
        borderRadius="md"
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="orange.500"
      >
        <Heading as="h4" size="sm" mb={2}>Rust Foundation — cargo-semver-checks</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Contributing to the cargo-semver-checks repository</ListItem>
          <ListItem>• Implementing type-checking lints for semantic versioning</ListItem>
          <ListItem>• Engaging with the Rust community on Zulip</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Programme</Meta>
          <span>Google Summer of Code 2026</span>
        </ListItem>
        <ListItem>
          <Meta>FFmpeg</Meta>
          <Link href="https://code.ffmpeg.org" target="_blank">
            code.ffmpeg.org <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Rust</Meta>
          <Link href="https://github.com/obi1kenobi/cargo-semver-checks" target="_blank">
            cargo-semver-checks <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Languages</Meta>
          <span>C, Rust</span>
        </ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
