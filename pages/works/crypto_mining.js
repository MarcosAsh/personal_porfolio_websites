import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  SimpleGrid,
  UnorderedList,
  Heading,
  Center,
  Image
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="cryptomining">
    <Container>
      <Title>
        Crypto mining <Badge>2021 - Current</Badge>
      </Title>
      <P>
        A list of my crypto mining equipment used
      </P>
      <UnorderedList ml={4} my={4}>
        <ListItem>Bitmain Antminer KS3 (8.3Th)</ListItem>
        <ListItem>Jasminer X16-P</ListItem>
        <ListItem>Bitmain Antminer L7 (9.05Gh)</ListItem>
        <ListItem>5x 3060ti gpu miner on KASPOW</ListItem>
        <ListItem>Goldshell ST-BOX</ListItem>
        <ListItem>iPollo G1</ListItem>
        <ListItem>2x Bitmain Antminer L7 (9.05Gh)</ListItem>
      </UnorderedList>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Hive OS, Nicehash and EasyMiner</span>
        </ListItem>
        <ListItem>
          <Meta>Thanks to this youtuber</Meta>
          <Link href="https://www.youtube.com/@RedPandaMining">
            Red panda mining
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Last update</Meta>
          <span>2023</span>
        </ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
