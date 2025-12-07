import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Heading,
  Box,
  useColorModeValue,
  SimpleGrid,
  Text
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Work = () => (
  <Layout title="Spot Micro AI Dog">
    <Container>
      <Title>
        Spot Micro AI Dog <Badge>2022 - Present</Badge>
      </Title>
      
      <P>
        An autonomous quadruped robot inspired by Boston Dynamics' Spot, designed and 
        built from the ground up. The robot features real-time LIDAR-based navigation, 
        sensor fusion algorithms, and AI-powered obstacle avoidance capabilities.
      </P>

      <Box 
        p={4} 
        my={4} 
        borderRadius="md" 
        bg={useColorModeValue('green.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="green.500"
      >
        <Heading as="h4" size="sm" mb={2}>Project Highlights</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} fontSize="sm">
          <Text>✓ Real-time LIDAR mapping</Text>
          <Text>✓ Autonomous navigation</Text>
          <Text>✓ Sensor fusion algorithms</Text>
          <Text>✓ Custom control software</Text>
          <Text>✓ Obstacle detection & avoidance</Text>
          <Text>✓ Commercially viable design</Text>
        </SimpleGrid>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Platform</Meta>
          <span>NVIDIA Jetson Nano</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Python, TensorFlow, PyBullet, ROS, Adafruit</span>
        </ListItem>
        <ListItem>
          <Meta>Sensors</Meta>
          <span>LIDAR, IMU, Camera</span>
        </ListItem>
        <ListItem>
          <Meta>Simulation</Meta>
          <Link href="https://github.com/MarcosAsh/Robot_Dog_Simulation" target="_blank">
            Robot Dog Simulation Repository <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Software</Meta>
          <Link href="https://github.com/MarcosAsh/Robot_Dog" target="_blank">
            Robot Dog Software Repository <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <Box 
        p={4} 
        my={4} 
        borderRadius="md" 
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        border="1px solid"
        borderColor={useColorModeValue('blue.200', 'blue.700')}
      >
        <Heading as="h4" size="sm" mb={2}>📌 Note on Source Code</Heading>
        <Text fontSize="sm">
          The main repository is private as this project represents significant development 
          effort and has commercial potential. If you are interested in learning more about 
          the technical details or potential collaboration, please contact me via email.
        </Text>
      </Box>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Technical Architecture
      </Heading>
      
      <P>
        The robot is powered by an NVIDIA Jetson Nano, providing sufficient computational 
        power for real-time sensor processing and AI inference. The LIDAR sensor creates 
        a 2D map of the environment, which is processed through custom SLAM algorithms to 
        enable autonomous navigation.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Key Technical Achievements
      </Heading>
      
      <List ml={6} my={2} spacing={2}>
        <ListItem>
          <strong>Sensor Fusion:</strong> Integrated data from multiple sensors (LIDAR, IMU, 
          encoders) to create a robust state estimation system
        </ListItem>
        <ListItem>
          <strong>Gait Control:</strong> Implemented smooth walking gaits using inverse 
          kinematics and trajectory planning
        </ListItem>
        <ListItem>
          <strong>Obstacle Avoidance:</strong> Real-time obstacle detection and path 
          replanning using LIDAR point cloud data
        </ListItem>
        <ListItem>
          <strong>Simulation Environment:</strong> Created a PyBullet simulation for 
          testing algorithms before deployment on hardware
        </ListItem>
      </List>

      <WorkImage src="/images/works/robot_dog1.png" alt="Robot Dog Front View" />
      <WorkImage src="/images/robot_dog.png" alt="Robot Dog Side View" />
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
