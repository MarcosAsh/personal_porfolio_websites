import {
  Container,
  Badge,
  List,
  ListItem,
  Heading,
  Box,
  useColorModeValue,
  SimpleGrid,
  Text
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="PC & Server Builds">
    <Container>
      <Title>
        PC & Server Builds <Badge>2017 - Present</Badge>
      </Title>
      
      <P>
        Custom-built high-performance computers optimized for software development, 
        machine learning workloads, and content creation. Each build is carefully 
        selected for optimal performance, thermal efficiency, and reliability.
      </P>

      <Box 
        p={4} 
        my={4} 
        borderRadius="md" 
        bg={useColorModeValue('purple.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="purple.500"
      >
        <Heading as="h4" size="sm" mb={2}>Development Environment</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} fontSize="sm">
          <Text>• Dual boot: Windows 11 / Ubuntu Linux</Text>
          <Text>• Docker (Certified)</Text>
          <Text>• IntelliJ IDEA & Fleet</Text>
          <Text>• VS Code</Text>
        </SimpleGrid>
      </Box>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Primary Development Workstation
      </Heading>
      
      <WorkImage src="/images/works/pc_build1.jpg" alt="Primary Workstation" />
      
      <List ml={4} my={4}>
        <ListItem>
          <Meta>CPU</Meta>
          <span>AMD Ryzen 7 5800X3D</span>
        </ListItem>
        <ListItem>
          <Meta>GPU</Meta>
          <span>NVIDIA RTX 3060 Ti Founders Edition</span>
        </ListItem>
        <ListItem>
          <Meta>Case</Meta>
          <span>FORMD T1 Sandwich Kit (SFF Build)</span>
        </ListItem>
        <ListItem>
          <Meta>Motherboard</Meta>
          <span>Gigabyte Aorus B550i Pro AX</span>
        </ListItem>
        <ListItem>
          <Meta>Use Case</Meta>
          <span>Development, ML training, Docker containers</span>
        </ListItem>
      </List>

      <P>
        This compact ITX build delivers exceptional single-thread performance for 
        compilation tasks, while the RTX 3060 Ti handles ML workloads and CUDA 
        acceleration. The small form factor allows for a clean, portable setup.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Secondary Workstation / Server
      </Heading>
      
      <WorkImage src="/images/works/pc1.webp" alt="Secondary Workstation" />
      
      <List ml={4} my={4}>
        <ListItem>
          <Meta>CPU</Meta>
          <span>AMD Ryzen 9 5900X (12 cores)</span>
        </ListItem>
        <ListItem>
          <Meta>GPU</Meta>
          <span>Gigabyte RTX 2080 Super</span>
        </ListItem>
        <ListItem>
          <Meta>Case</Meta>
          <span>Fractal Torrent Compact</span>
        </ListItem>
        <ListItem>
          <Meta>Motherboard</Meta>
          <span>MSI X570</span>
        </ListItem>
        <ListItem>
          <Meta>Use Case</Meta>
          <span>Parallel computing, server hosting, rendering</span>
        </ListItem>
      </List>

      <P>
        This workstation serves as both a development machine and home server. 
        The 12-core Ryzen 9 5900X excels at parallel workloads, making it ideal 
        for running multiple Docker containers, virtual machines, and concurrent 
        compilation jobs.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Infrastructure Use Cases
      </Heading>
      
      <List ml={6} my={2} spacing={1}>
        <ListItem>• Local development and testing environments</ListItem>
        <ListItem>• Machine learning model training</ListItem>
        <ListItem>• Docker container orchestration</ListItem>
        <ListItem>• Home media and file server</ListItem>
        <ListItem>• Virtual machine hosting for multi-OS testing</ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
