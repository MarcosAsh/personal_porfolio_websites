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
  <Layout title="PC Builds">
    <Container>
      <Title>
        PC & Server Builds <Badge>2017 - CURRENT</Badge>
      </Title>
      <P>
        Custom-built high-performance computers optimized for development, machine learning, 
        and content creation. Each build is carefully selected for optimal performance, 
        thermal efficiency, and reliability.
      </P>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Operating System</Meta>
          <span>Dual boot Windows 11 / Ubuntu Linux</span>
        </ListItem>
        <ListItem>
          <Meta>Development Tools</Meta>
          <span>Docker (certified), Git, VS Code</span>
        </ListItem>
        <ListItem>
          <Meta>Preferred IDEs</Meta>
          <span>IntelliJ IDEA and Fleet</span>
        </ListItem>
      </List>

      <Heading as="h4" fontSize={16} my={4}>
        Primary Development Workstation
      </Heading>
      <WorkImage src="/images/works/pc_build1.jpg" alt="pcbuild" />
      <List ml={4} my={4}>
        <ListItem>
          <Meta>CPU</Meta>
          AMD Ryzen 7 5800X3D
        </ListItem>
        <ListItem>
          <Meta>GPU</Meta>
          NVIDIA RTX 3060 Ti Founders Edition
        </ListItem>
        <ListItem>
          <Meta>Case</Meta>
          FORMD T1 Sandwich Kit (SFF Build)
        </ListItem>
        <ListItem>
          <Meta>Motherboard</Meta>
          Gigabyte Aorus B550i Pro AX
        </ListItem>
        <ListItem>
          <Meta>Use Case</Meta>
          <span>Software development, ML training, Docker containers</span>
        </ListItem>
      </List>

      <P>
        This compact ITX build delivers exceptional performance for development work while 
        maintaining a small footprint. The Ryzen 7 5800X3D provides excellent single-thread 
        performance for compilation and the RTX 3060 Ti handles ML workloads and CUDA acceleration.
      </P>

      <Heading as="h4" fontSize={16} my={4}>
        Secondary Workstation / Server
      </Heading>
      <WorkImage src="/images/works/pc1.webp" alt="pcbuild" />
      <List ml={4} my={4}>
        <ListItem>
          <Meta>CPU</Meta>
          AMD Ryzen 9 5900X
        </ListItem>
        <ListItem>
          <Meta>GPU</Meta>
          Gigabyte RTX 2080 Super
        </ListItem>
        <ListItem>
          <Meta>Case</Meta>
          Fractal Torrent Compact
        </ListItem>
        <ListItem>
          <Meta>Motherboard</Meta>
          MSI X570
        </ListItem>
        <ListItem>
          <Meta>Use Case</Meta>
          <span>Parallel computing, server hosting, rendering, testing</span>
        </ListItem>
      </List>

      <P>
        This workstation serves as both a development machine and home server. The 12-core 
        Ryzen 9 5900X excels at parallel workloads, making it ideal for running multiple 
        Docker containers, virtual machines, and compilation jobs simultaneously.
      </P>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'