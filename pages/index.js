import NextLink from 'next/link'
import {
  Link,
  Container,
  Heading,
  Box,
  SimpleGrid,
  Button,
  List,
  ListItem,
  useColorModeValue,
  chakra
} from '@chakra-ui/react'
import { ChevronRightIcon, EmailIcon } from '@chakra-ui/icons'
import Paragraph from '../components/paragraph'
import { BioSection, BioYear } from '../components/bio'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'
import { IoLogoInstagram, IoLogoGithub } from 'react-icons/io5'
import thumbYouTube from '../public/images/EPQ.png'
import thumbInkdrop from '../public/images/robot_dog.png'
import Image from 'next/image'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const Home = () => (
  <Layout>
    <Container>
      <Box
        borderRadius="lg"
        mb={6}
        p={3}
        textAlign="center"
        bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
        css={{ backdropFilter: 'blur(10px)' }}
      >
        Hello I&apos;m a Spanish developer studying Computer Science at University of Exeter
      </Box>

      <Box display={{ md: 'flex' }}>
        <Box flexGrow={1}>
          <Heading as="h2" variant="page-title">
            Marcos Ashton
          </Heading>
          <p>Computer Science Student & Programmer</p>
        </Box>
        <Box
          flexShrink={0}
          mt={{ base: 4, md: 0 }}
          ml={{ md: 6 }}
          textAlign="center"
        >
          <Box
            borderColor="whiteAlpha.800"
            borderWidth={2}
            borderStyle="solid"
            w="100px"
            h="100px"
            display="inline-block"
            borderRadius="full"
            overflow="hidden"
          >
            <ProfileImage
              src="/loogo.jfif"
              alt="Profile image"
              borderRadius="full"
              width="100"
              height="100"
            />
          </Box>
        </Box>
      </Box>

      <Section delay={0.1}>
        <Heading as="h3" variant="section-title">
          About
        </Heading>
        <Paragraph>
          I am a Computer Science student at the University of Exeter. 
          I&apos;m proficient in Python, C, C++, and web technologies including HTML, CSS, JavaScript, 
          Next.js, and React. I have hands-on experience with Jetson Nano, LIDAR, TensorFlow, Docker, 
          AWS, and Modal. I&apos;m also the founder of a robotics company where I designed and 
          implemented an autonomous robotic dog with real-time LIDAR navigation. You can see my 
          robot here:{' '}
          <Link as={NextLink} href="/works/robot_dog" passHref scroll={false}>
            Robot dog
          </Link>
          . I also completed an EPQ on machine learning for agricultural applications:{' '}
          <Link as={NextLink} href="/works/EPQ" passHref scroll={false}>
            EPQ
          </Link>
        </Paragraph>
        <Box align="center" my={4}>
          <Button
            as={NextLink}
            href="/works"
            scroll={false}
            rightIcon={<ChevronRightIcon />}
            colorScheme="teal"
          >
            My portfolio
          </Button>
        </Box>
      </Section>

      <Section delay={0.2}>
        <Heading as="h3" variant="section-title">
          Bio
        </Heading>
        <BioSection>
          <BioYear>2006</BioYear>
          Born in Madrid, Spain
        </BioSection>
        <BioSection>
          <BioYear>2021</BioYear>
          Founded my robotics company
        </BioSection>
        <BioSection>
          <BioYear>2022</BioYear>
          Started my EPQ (Extended Project Qualification)
        </BioSection>
        <BioSection>
          <BioYear>2023</BioYear>
          Started developing websites and web applications
        </BioSection>
        <BioSection>
          <BioYear>2024</BioYear>
          Graduated from Hastings School
        </BioSection>
        <BioSection>
          <BioYear>2024 to present</BioYear>
          Studying BSc Computer Science at University of Exeter
        </BioSection>
      </Section>

      <Section delay={0.25}>
        <Heading as="h3" variant="section-title">
          Skills
        </Heading>
        <Paragraph>
          <strong>Programming:</strong> Python, C, C++, HTML, CSS, JavaScript, Java
        </Paragraph>
        <Paragraph>
          <strong>Tools & Technologies:</strong> Jetson Nano, LIDAR, Next.js, TensorFlow, 
          Scikit-learn, Docker (certified), AWS, Modal, Git, GitHub, ROS
        </Paragraph>
        <Paragraph>
          <strong>Languages:</strong> English (fluent), Spanish (fluent)
        </Paragraph>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          Highlighted Projects
        </Heading>
        <Paragraph>
          <strong>Spot Micro AI Dog:</strong> Designed and implemented an autonomous robotic dog 
          with real-time LIDAR navigation and obstacle detection.
        </Paragraph>
        <Paragraph>
          <strong>Fluid Dynamics Simulation:</strong> Developed a 3D fluid simulation in C using 
          Navier-Stokes equations with AWS and Modal backend.
        </Paragraph>
        <Paragraph>
          <strong>Satellite Telemetry for Crop Prediction:</strong> Built ML models achieving 70.4% 
          accuracy predicting avocado crop yields using historical satellite data.
        </Paragraph>
        <Paragraph>
          <strong>Chess Engine:</strong> Developed a C++ chess engine achieving an 800 rating on Lichess.
        </Paragraph>
      </Section>

      <Section delay={0.35}>
        <Heading as="h3" variant="section-title">
          Hackathons
        </Heading>
        <Paragraph>
          <strong>Nebrija:</strong> Placed 10th overall from 150 competitors
        </Paragraph>
        <Paragraph>
          <strong>Movember:</strong> First place - Created an image classifier for skin cancer 
          prediction with 80% accuracy
        </Paragraph>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          My Interests
        </Heading>
        <Paragraph>
          Machine Learning, Computer Hardware, Cryptocurrency Mining, Mathematics, 
          Computer Architecture, Robotics, and Basketball.
        </Paragraph>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          On the web
        </Heading>
        <List>
          <ListItem>
            <Link href="https://github.com/MarcosAsh" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<IoLogoGithub />}
              >
                @MarcosAsh
              </Button>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://www.instagram.com/marcos_aashton/" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<IoLogoInstagram />}
              >
                @marcos__aashton
              </Button>
            </Link>
          </ListItem>
        </List>

        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          <GridItem
            href="works\EPQ"
            title="EPQ"
            thumbnail={thumbYouTube}
          >
            My Extended Project Qualification
          </GridItem>
          <GridItem
            href="works\robot_dog"
            title="Robotics Company"
            thumbnail={thumbInkdrop}
          >
            A robot quadruped design
          </GridItem>
        </SimpleGrid>

        <Heading as="h3" variant="section-title">
          Contact me
        </Heading>
        <p>
          If you have any questions or opportunities, please feel free to contact me.
        </p>

        <Box align="center" my={4}>
          <Button
            as={NextLink}
            href=""
            scroll={false}
            leftIcon={<EmailIcon />}
            colorScheme="teal"
          >
            marcosashiglesias@gmail.com
          </Button>
        </Box>
      </Section>
    </Container>
  </Layout>
)

export default Home
export { getServerSideProps } from '../components/chakra'