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
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Layout from '../../components/layouts/article'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const PRItem = ({ number, title, area }) => (
  <ListItem mb={2}>
    <Link
      href={`https://code.ffmpeg.org/FFmpeg/FFmpeg/pulls/${number}`}
      target="_blank"
      fontWeight="medium"
    >
      #{number}
    </Link>{' '}
    <Badge ml={1} fontSize="xs" colorScheme="purple">{area}</Badge>
    <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')}>
      {title}
    </Text>
  </ListItem>
)

const Work = () => (
  <Layout title="FFmpeg Contributions">
    <Container>
      <Title>
        FFmpeg — Open Source <Badge>2026</Badge>
      </Title>

      <P>
        Eight merged pull requests to FFmpeg, the open source multimedia framework
        used by virtually every major video application. Contributions cover the
        FATE regression test suite (libavutil and decoder coverage), correctness
        fixes in libavfilter and libavutil, and small cleanups in low-level code.
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
          <ListItem>• Added FATE test coverage for film_grain_params, stereo3d, and pcm_bluray decoders</ListItem>
          <ListItem>• Added FATE tests for several libavutil components (buffer, hdr_dynamic_vivid_metadata, tdrdi, timestamp, rc4, samplefmt, mathematics, spherical, detection_bbox, video_enc_params)</ListItem>
          <ListItem>• Fixed prefix matching bug in libavutil/stereo3d *_from_name() lookups</ListItem>
          <ListItem>• Fixed an operator precedence bug in vf_v360 stereo loop condition</ListItem>
          <ListItem>• Fixed sscanf() return value checks in af_pan</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Repository</Meta>
          <Link href="https://code.ffmpeg.org/FFmpeg/FFmpeg" target="_blank">
            code.ffmpeg.org/FFmpeg/FFmpeg <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>PRs</Meta>
          <span>8 merged</span>
        </ListItem>
        <ListItem>
          <Meta>Languages</Meta>
          <span>C</span>
        </ListItem>
        <ListItem>
          <Meta>Areas</Meta>
          <span>FATE testing, libavutil, libavfilter</span>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Merged Pull Requests
      </Heading>

      <List spacing={2}>
        <PRItem
          number={22767}
          area="avutil"
          title="tests/fate/libavutil: add FATE tests for buffer, hdr_dynamic_vivid_metadata, tdrdi, timestamp"
        />
        <PRItem
          number={22673}
          area="avutil"
          title="tests/fate/libavutil: add FATE tests for rc4, samplefmt, mathematics"
        />
        <PRItem
          number={22622}
          area="avutil"
          title="tests/fate/libavutil: add FATE tests for spherical, detection_bbox, video_enc_params"
        />
        <PRItem
          number={22593}
          area="avfilter"
          title="libavfilter/vf_v360: fix operator precedence in stereo loop condition"
        />
        <PRItem
          number={22582}
          area="avutil"
          title="libavutil/stereo3d: fix prefix matching in *_from_name() functions"
        />
        <PRItem
          number={22573}
          area="avfilter"
          title="avfilter/af_pan: fix sscanf() return value checks in parse_channel_name"
        />
        <PRItem
          number={22572}
          area="avutil"
          title="avutil/bswap: fix implicit conversion warning in av_bswap64"
        />
        <PRItem
          number={22258}
          area="avutil"
          title="tests/fate: add FATE tests for film_grain_params, stereo3d, pcm_bluray"
        />
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        FATE Test Coverage
      </Heading>

      <P>
        The bulk of the work expanded FATE, FFmpeg&apos;s regression test suite,
        adding coverage for previously untested libavutil components and
        decoder paths. Tests were written in C, integrated into the existing
        Makefile-driven harness, and validated against reference outputs across
        the FFmpeg CI matrix.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Correctness Fixes
      </Heading>

      <P>
        Smaller patches addressed real bugs in shipping code: a prefix-matching
        edge case in stereo3d_*_from_name(), an operator precedence error in the
        v360 filter&apos;s stereo handling, and incorrect sscanf() return-value
        checks in af_pan&apos;s channel name parser.
      </P>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
