import { Container, Heading, SimpleGrid, Divider } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'

import thumbepq from '../public/images/EPQ.png'
import thumbtensorflow from '../public/images/TENSORFLOW.jpg'
import thumbrobotdog from '../public/images/robot_dog.png'
import thumbcurrentwebsite from '../public/images/links/Current-website.jpg'
import thumbkinematics from '../public/images/kinematics.jpg'
import thumbandriod from '../public/images/andriod.png'
import thumbpcbuilds from '../public/images/torrent.jpeg'
import thumbminers from '../public/images/miner.jpg'
import thumbaiclub from '../public/images/aiclub.jpg'
import thumbfluidsim from '../public/images/links/Current-website.jpg' // Add your fluid sim image
import thumbchess from '../public/images/links/Current-website.jpg' // Add your chess image

const Works = () => (
  <Layout title="Works">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
         Works
      </Heading>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section>
          <WorkGridItem
            id="robot_dog"
            title="Spot Micro AI Dog"
            thumbnail={thumbrobotdog}
          >
            Autonomous robotic dog with real-time LIDAR navigation and sensor fusion for obstacle detection
          </WorkGridItem>
        </Section>
        
        <Section>
          <WorkGridItem
            id="fluid_sim"
            title="Fluid Dynamics Simulation"
            thumbnail={thumbfluidsim}
          >
            3D fluid simulation in C using Navier-Stokes equations with AWS and Modal backend
          </WorkGridItem>
        </Section>

        <Section delay={0.1}>
          <WorkGridItem
            id="EPQ"
            title="Satellite Telemetry for Crop Prediction"
            thumbnail={thumbepq}
            >
            Machine learning model achieving 70.4% accuracy predicting avocado crop yields
          </WorkGridItem>
        </Section>
        
        <Section delay={0.1}>
          <WorkGridItem
            id="chess_engine"
            title="Chess Engine"
            thumbnail={thumbchess}
            >
            C++ chess engine with move evaluation and pruning algorithms (800 Lichess rating)
          </WorkGridItem>
        </Section>
        
        <Section delay={0.1}>
          <WorkGridItem
            id="Current_website"
            title="Personal Portfolio Website"
            thumbnail={thumbcurrentwebsite}
            >
            Responsive portfolio with 3D animations using Next.js, Three.js, and Chakra UI
          </WorkGridItem>
        </Section>
        
        <Section delay={0.1}>
          <WorkGridItem
            id="AIclub"
            title="AI Club Website"
            thumbnail={thumbaiclub}
            >
            Interactive AI club website with chatbot integration
          </WorkGridItem>
        </Section>
        
        <Section delay={0.1}>
          <WorkGridItem
            id="Tensorflow"
            title="TensorFlow Projects"
            thumbnail={thumbtensorflow}
            >
            Collection of deep learning and computer vision projects using TensorFlow
          </WorkGridItem>
        </Section>
      </SimpleGrid>
      
      <Section delay={0.2}>
        <Divider my={6} />

        <Heading as="h3" fontSize={20} mb={4}>
          Additional Projects
        </Heading>
      </Section>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section delay={0.3}>
          <WorkGridItem
            id="kinematics"
            thumbnail={thumbkinematics}
            title="Kinematics for Robot Dog"
            >
            Mathematical calculations and algorithms for robotic locomotion
          </WorkGridItem>
        </Section>
        <Section delay={0.3}>
          <WorkGridItem
            id="andriod"
            thumbnail={thumbandriod}
            title="Android Applications"
          >
            Mobile applications developed for Android platform
          </WorkGridItem>
        </Section>
        <Section delay={0.3}>
          <WorkGridItem
            id="pcbuilds"
            thumbnail={thumbpcbuilds}
            title="PC / Server Builds"
            >
            Custom PC builds and home network infrastructure
          </WorkGridItem>
        </Section>
        <Section delay={0.3}>
          <WorkGridItem
            id="crypto_mining"
            thumbnail={thumbminers}
            title="Cryptocurrency Mining"
            >
            Cryptocurrency mining operation with multiple ASIC and GPU miners
          </WorkGridItem>
        </Section>
      </SimpleGrid>


    </Container>
  </Layout>
)

export default Works
export { getServerSideProps } from '../components/chakra'