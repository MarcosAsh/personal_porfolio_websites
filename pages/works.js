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
const Works = () => (
  <Layout title="Works">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
         Works
      </Heading>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section>
          <WorkGridItem
            id="EPQ"
            title="EPQ"
            thumbnail={thumbepq}
            >
            A machine learning model that predicts the crop yeild from certain data.
          </WorkGridItem>
        </Section>
        <Section>
          <WorkGridItem
            id="Current_website"
            title="This website"
            thumbnail={thumbcurrentwebsite}
            >
            The website you are currently on
          </WorkGridItem>
        </Section>

        <Section delay={0.1}>
          <WorkGridItem
            id="robot_dog"
            title="Robot dog"
            thumbnail={thumbrobotdog}
          >
            A company I'am the founder of where we make open source quadraped robots.
          </WorkGridItem>
        </Section>
        <Section delay={0.1}>
          <WorkGridItem
            id="Tensorflow"
            title="Tensorflow"
            thumbnail={thumbtensorflow}
            >
            Missalanious tensorflow projects that solve diffrent issues
          </WorkGridItem>
        </Section>
        <Section delay={0.1}>
          <WorkGridItem
            id="AIclub"
            title="AI club"
            thumbnail={thumbaiclub}
            >
            The final AI club website chatbot with a similiar stack to this website.
          </WorkGridItem>
        </Section>
      </SimpleGrid>
      <Section delay={0.2}>
        <Divider my={6} />

        <Heading as="h3" fontSize={20} mb={4}>
          Sub-Works
        </Heading>
      </Section>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section delay={0.3}>
          <WorkGridItem
            id="kinematics"
            thumbnail={thumbkinematics}
            title="Kinematics for robot dog"
            >
            The calculations that where necassery for the development of the robot dog
          </WorkGridItem>
        </Section>
        <Section delay={0.3}>
          <WorkGridItem
            id="andriod"
            thumbnail={thumbandriod}
            title="Andriod apps"
          >
            [insert andriod app description]
          </WorkGridItem>
        </Section>
        <Section delay={0.3}>
          <WorkGridItem
            id="pcbuilds"
            thumbnail={thumbpcbuilds}
            title="PC / Server builds"
            >
            A list of all builds and my home network
          </WorkGridItem>
        </Section>
        <Section delay={0.3}>
          <WorkGridItem
            id="crypto_mining"
            thumbnail={thumbminers}
            title="Crypto Mining"
            >
            A Crypto mining buissness I started.
          </WorkGridItem>
        </Section>
      </SimpleGrid>


    </Container>
  </Layout>
)

export default Works
export { getServerSideProps } from '../components/chakra'
