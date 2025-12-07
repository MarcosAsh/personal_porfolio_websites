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
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Robot Kinematics">
    <Container>
      <Title>
        Kinematics for Robot Dog <Badge>2023</Badge>
      </Title>
      
      <P>
        Mathematical calculations and algorithms for controlling the locomotion of 
        the Spot Micro robot dog. This work forms the foundation of the robot's 
        movement system, enabling smooth and stable walking gaits.
      </P>

      <Box 
        p={4} 
        my={4} 
        borderRadius="md" 
        bg={useColorModeValue('green.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="green.500"
      >
        <Heading as="h4" size="sm" mb={2}>Mathematical Concepts</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Forward Kinematics - Joint angles to end effector position</ListItem>
          <ListItem>• Inverse Kinematics - Desired position to joint angles</ListItem>
          <ListItem>• Jacobian matrices for velocity control</ListItem>
          <ListItem>• Trajectory planning algorithms</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Method</Meta>
          <span>Mathematical derivation and implementation</span>
        </ListItem>
        <ListItem>
          <Meta>Application</Meta>
          <span>Quadruped robot locomotion control</span>
        </ListItem>
        <ListItem>
          <Meta>Resources</Meta>
          <Link href="https://www.youtube.com/watch?v=dHjWVlfNraM" target="_blank">
            Organic Chemistry Tutor - Kinematics <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Physics</Meta>
          <Link href="https://www.youtube.com/watch?v=q9IWoQ199_o" target="_blank">
            Walter Lewin Physics Lectures <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Technical Details
      </Heading>
      
      <P>
        The kinematics calculations involve transforming between the robot's base 
        frame and each foot's position in 3D space. For a quadruped, each leg has 
        3 degrees of freedom (hip, upper leg, lower leg), requiring careful geometric 
        analysis to compute the inverse kinematics.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Implementation Approach
      </Heading>
      
      <List ml={6} my={2} spacing={2}>
        <ListItem>
          <strong>Geometric Method:</strong> Used trigonometric relationships to derive 
          closed-form solutions for the 3-DOF leg
        </ListItem>
        <ListItem>
          <strong>Workspace Analysis:</strong> Determined the reachable workspace for 
          each leg configuration
        </ListItem>
        <ListItem>
          <strong>Gait Generation:</strong> Created smooth trajectories for trot, walk, 
          and creep gaits
        </ListItem>
      </List>

      <P>
        These calculations are available for anyone working on similar robotics 
        projects. The mathematical foundations are universal and can be adapted 
        to different robot configurations.
      </P>

      <WorkImage src="/images/works/kinematics1.jpeg" alt="Kinematics Diagram 1" />
      <WorkImage src="/images/works/kinematics2.jpeg" alt="Kinematics Diagram 2" />
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
