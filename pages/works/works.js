import { Container, Heading, SimpleGrid, Divider, Text, Box, useColorModeValue } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'

import thumbepq from '../public/images/EPQ.png'
import thumbtensorflow from '../public/images/TENSORFLOW.jpg'
import thumbrobotdog from '../public/images/robot_dog.png'
import thumbcurrentwebsite from '../public/images/links/Current-website.jpg'
import thumbkinematics from '../public/images/kinematics.jpg'
import thumbandroid from '../public/images/andriod.png'
import thumbpcbuilds from '../public/images/torrent.jpeg'
import thumbminers from '../public/images/miner.jpg'
import thumbaiclub from '../public/images/aiclub.jpg'

const Works = () => (
  <Layout title="Works">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Projects & Works
      </Heading>
      
      <Text mb={6} color={useColorModeValue('gray.600', 'gray.400')}>
        A collection of my technical projects, ranging from robotics and machine learning 
        to web development and system building.
      </Text>

      <Box mb={6}>
        <Heading as="h4" fontSize={16} mb={4} color="cyan.500">
          Featured Projects
        </Heading>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section>
            <WorkGridItem
              id="robot_dog"
              title="Spot Micro AI Dog"
              thumbnail={thumbrobotdog}
            >
              Autonomous robotic quadruped with real-time LIDAR navigation and sensor fusion for obstacle detection
            </WorkGridItem>
          </Section>
          
          <Section>
            <WorkGridItem
              id="fluid_sim"
              title="Fluid Dynamics Simulation"
              thumbnail={thumbcurrentwebsite}
            >
              3D fluid simulation in C using Navier-Stokes equations with AWS and Modal backend
            </WorkGridItem>
          </Section>

          <Section delay={0.1}>
            <WorkGridItem
              id="EPQ"
              title="Satellite Crop Prediction"
              thumbnail={thumbepq}
            >
              Machine learning model achieving 70.4% accuracy predicting avocado crop yields using satellite telemetry
            </WorkGridItem>
          </Section>
          
          <Section delay={0.1}>
            <WorkGridItem
              id="chess_engine"
              title="Chess Engine"
              thumbnail={thumbcurrentwebsite}
            >
              C++ chess engine with move evaluation and pruning algorithms achieving 800 Lichess rating
            </WorkGridItem>
          </Section>
        </SimpleGrid>
      </Box>

      <Divider my={6} />

      <Box mb={6}>
        <Heading as="h4" fontSize={16} mb={4} color="cyan.500">
          Web Development
        </Heading>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section delay={0.2}>
            <WorkGridItem
              id="Current_website"
              title="Personal Portfolio"
              thumbnail={thumbcurrentwebsite}
            >
              Responsive portfolio with 3D animations using Next.js, Three.js, and Chakra UI
            </WorkGridItem>
          </Section>
          
          <Section delay={0.2}>
            <WorkGridItem
              id="AIclub"
              title="AI Club Website"
              thumbnail={thumbaiclub}
            >
              Interactive AI club website with chatbot integration using Vite, Three.js, and Flask
            </WorkGridItem>
          </Section>
        </SimpleGrid>
      </Box>

      <Divider my={6} />

      <Box mb={6}>
        <Heading as="h4" fontSize={16} mb={4} color="cyan.500">
          Machine Learning & AI
        </Heading>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section delay={0.3}>
            <WorkGridItem
              id="Tensorflow"
              title="TensorFlow Projects"
              thumbnail={thumbtensorflow}
            >
              Collection of deep learning and computer vision projects including CNNs and model deployment
            </WorkGridItem>
          </Section>
          
          <Section delay={0.3}>
            <WorkGridItem
              id="kinematics"
              thumbnail={thumbkinematics}
              title="Robot Kinematics"
            >
              Mathematical calculations and algorithms for robotic quadruped locomotion
            </WorkGridItem>
          </Section>
        </SimpleGrid>
      </Box>

      <Divider my={6} />

      <Box mb={6}>
        <Heading as="h4" fontSize={16} mb={4} color="cyan.500">
          Hardware & Infrastructure
        </Heading>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section delay={0.4}>
            <WorkGridItem
              id="android"
              thumbnail={thumbandroid}
              title="Android Applications"
            >
              Mobile applications developed for the Android platform
            </WorkGridItem>
          </Section>
          <Section delay={0.4}>
            <WorkGridItem
              id="pcbuilds"
              thumbnail={thumbpcbuilds}
              title="PC & Server Builds"
            >
              Custom high-performance PC builds and home network infrastructure
            </WorkGridItem>
          </Section>
          <Section delay={0.4}>
            <WorkGridItem
              id="crypto_mining"
              thumbnail={thumbminers}
              title="Cryptocurrency Mining"
            >
              Mining operation with multiple ASIC and GPU miners including Antminer KS3 and L7
            </WorkGridItem>
          </Section>
        </SimpleGrid>
      </Box>
    </Container>
  </Layout>
)

export default Works
export { getServerSideProps } from '../components/chakra'
