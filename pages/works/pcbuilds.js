import {
  Container,
  Badge,
  List,
  ListItem
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="pcbuild">
    <Container>
      <Title>
        Pc builds <Badge>2017 - CURRENT</Badge>
      </Title>
      <P>
        All of my current pc builds
      </P>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>OS</Meta>
          <span>Dual boot windows 11 / ubuntu</span>
        </ListItem>
        <ListItem>
          <Meta>Prfered IDE</Meta>
          <span>IntelliJ and Fleet</span>
        </ListItem>
      </List>
      <WorkImage src="/images/works/pc_build1.jpg" alt="pcbuild" />
      <List ml={4} my={4}>
      <ListItem>
        <Meta>CPU</Meta>
        Ryzen 7 5800x3d
      </ListItem>
        <ListItem>
          <Meta>GPU</Meta>
          RTX 3060 ti FE
        </ListItem>
        <ListItem>
          <Meta>Case</Meta>
          FORMD T1 Sandwitch kit
        </ListItem>
        <ListItem>
          <Meta>MOBO</Meta>
          Gigabyte Aurous b550i 
        </ListItem>
      </List>
      <WorkImage src="/images/works/pc1.webp" alt="pcbuild" />
      <List ml={4} my={4}>
        <ListItem>
          <Meta>CPU</Meta>
          Ryzen 9 5900x
        </ListItem>
        <ListItem>
          <Meta>GPU</Meta>
          Gigabyte RTX 2080 super 
        </ListItem>
        <ListItem>
          <Meta>Case</Meta>
          Fractal Torrent Compact
        </ListItem>
        <ListItem>
          <Meta>MOBO</Meta>
          MSI x570
        </ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
