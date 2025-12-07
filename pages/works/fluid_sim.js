import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Heading,
  Text,
  Box,
  useColorModeValue
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Fluid Dynamics Simulation">
    <Container>
      <Title>
        Fluid Dynamics Simulation <Badge>2024</Badge>
      </Title>
      
      <P>
        A sophisticated 3-dimensional fluid simulation developed in C to model real-time 
        flow dynamics using the Navier-Stokes equations. This project demonstrates advanced 
        numerical methods and high-performance computing techniques.
      </P>

      <Box 
        p={4} 
        my={4} 
        borderRadius="md" 
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="cyan.500"
      >
        <Heading as="h4" size="sm" mb={2}>Key Achievements</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Implemented numerical solvers for advection and diffusion</ListItem>
          <ListItem>• Created realistic fluid motion simulation</ListItem>
          <ListItem>• Built scalable cloud backend using AWS and Modal</ListItem>
          <ListItem>• Developed interactive web-based visualization</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Live Demo</Meta>
          <Link href="https://fluid-sim-frontend.vercel.app/" target="_blank">
            fluid-sim-frontend.vercel.app <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Web (Cross-platform)</span>
        </ListItem>
        <ListItem>
          <Meta>Backend</Meta>
          <span>AWS, Modal</span>
        </ListItem>
        <ListItem>
          <Meta>Frontend</Meta>
          <span>Vercel</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>C, Numerical Methods, Data Visualization, WebGL</span>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Technical Details
      </Heading>
      
      <P>
        The simulation solves the incompressible Navier-Stokes equations using a 
        semi-Lagrangian advection scheme combined with a pressure projection method. 
        The implementation focuses on stability and visual accuracy while maintaining 
        real-time performance.
      </P>

      <P>
        The backend infrastructure leverages AWS for compute resources and Modal for 
        serverless GPU acceleration, enabling complex simulations to run efficiently 
        in the cloud. The frontend provides an interactive interface where users can 
        manipulate fluid parameters and observe the resulting dynamics in real-time.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Mathematical Foundation
      </Heading>
      
      <P>
        The project implements core fluid dynamics equations including:
      </P>
      <List ml={6} my={2} spacing={1}>
        <ListItem>• Momentum equation (velocity field evolution)</ListItem>
        <ListItem>• Continuity equation (mass conservation)</ListItem>
        <ListItem>• Pressure Poisson equation</ListItem>
        <ListItem>• Viscous diffusion terms</ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
