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
  chakra,
  Badge,
  Text,
  Wrap,
  WrapItem,
  Divider
} from '@chakra-ui/react'
import { ChevronRightIcon, EmailIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import Paragraph from '../components/paragraph'
import { BioSection, BioYear } from '../components/bio'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'
import { IoLogoLinkedin, IoLogoGithub, IoDocumentText } from 'react-icons/io5'
import thumbYouTube from '../public/images/EPQ.png'
import thumbInkdrop from '../public/images/robot_dog.png'
import Image from 'next/image'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const SkillBadge = ({ children }) => (
  <Badge
    px={2}
    py={1}
    borderRadius="md"
    fontSize="xs"
    fontWeight="medium"
    colorScheme="cyan"
    variant="subtle"
  >
    {children}
  </Badge>
)

const Home = () => (
  <Layout>
    <Container>
      <Box
        borderRadius="lg"
        mb={6}
        p={4}
        textAlign="center"
        bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.200')}
        css={{ backdropFilter: 'blur(10px)' }}
        boxShadow="sm"
      >
        <Text fontSize="md" fontWeight="medium">
          Computer Science Student at University of Exeter
        </Text>
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} mt={1}>
          Specializing in Robotics, Machine Learning & Full-Stack Development
        </Text>
      </Box>

      <Box display={{ md: 'flex' }}>
        <Box flexGrow={1}>
          <Heading as="h2" variant="page-title">
            Marcos Ashton Iglesias
          </Heading>
          <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')} mt={1}>
            Developer • Robotics Engineer • ML Enthusiast
          </Text>
          <Box mt={2}>
            <Badge colorScheme="green" mr={2}>Available for Internships</Badge>
            <Badge colorScheme="blue">UK Student Visa</Badge>
          </Box>
        </Box>
        <Box
          flexShrink={0}
          mt={{ base: 4, md: 0 }}
          ml={{ md: 6 }}
          textAlign="center"
        >
          <Box
            borderColor={useColorModeValue('gray.300', 'whiteAlpha.800')}
            borderWidth={3}
            borderStyle="solid"
            w="110px"
            h="110px"
            display="inline-block"
            borderRadius="full"
            overflow="hidden"
            boxShadow="lg"
          >
            <ProfileImage
              src="/loogo.jfif"
              alt="Profile image"
              borderRadius="full"
              width="110"
              height="110"
            />
          </Box>
        </Box>
      </Box>

      <Section delay={0.1}>
        <Heading as="h3" variant="section-title">
          About Me
        </Heading>
        <Paragraph>
          I am a Computer Science student at the University of Exeter. 
          My passion lies at the intersection of robotics, machine learning, and software engineering. 
          I founded a robotics company where I designed and implemented an autonomous robotic dog 
          featuring real-time LIDAR navigation and obstacle detection.
        </Paragraph>
        <Paragraph>
          I am proficient in Python, C, C++, and modern web technologies including React, Next.js, 
          and Node.js. I have hands-on experience with embedded systems (Jetson Nano), computer vision 
          (TensorFlow), and cloud infrastructure (AWS, Docker, Modal).
        </Paragraph>
        <Box align="center" my={4}>
          <Button
            as={NextLink}
            href="/works"
            scroll={false}
            rightIcon={<ChevronRightIcon />}
            colorScheme="cyan"
          >
            View My Portfolio
          </Button>
        </Box>
      </Section>

      <Section delay={0.2}>
        <Heading as="h3" variant="section-title">
          Technical Skills
        </Heading>
        <Box mb={4}>
          <Text fontWeight="semibold" mb={2} fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
            Programming Languages
          </Text>
          <Wrap spacing={2}>
            <WrapItem><SkillBadge>Python</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>C</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>C++</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>JavaScript</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Java</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>HTML/CSS</SkillBadge></WrapItem>
          </Wrap>
        </Box>
        <Box mb={4}>
          <Text fontWeight="semibold" mb={2} fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
            Frameworks & Tools
          </Text>
          <Wrap spacing={2}>
            <WrapItem><SkillBadge>Next.js</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>React</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>TensorFlow</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Scikit-learn</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Docker</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>AWS</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Modal</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Git</SkillBadge></WrapItem>
          </Wrap>
        </Box>
        <Box mb={4}>
          <Text fontWeight="semibold" mb={2} fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
            Hardware & Robotics
          </Text>
          <Wrap spacing={2}>
            <WrapItem><SkillBadge>Jetson Nano</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>LIDAR</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>ROS</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Sensor Fusion</SkillBadge></WrapItem>
          </Wrap>
        </Box>
        <Box>
          <Text fontWeight="semibold" mb={2} fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
            Languages
          </Text>
          <Wrap spacing={2}>
            <WrapItem><SkillBadge>English (Fluent)</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Spanish (Fluent)</SkillBadge></WrapItem>
          </Wrap>
        </Box>
      </Section>

      <Section delay={0.25}>
        <Heading as="h3" variant="section-title">
          Education
        </Heading>
        <Box 
          p={4} 
          borderRadius="md" 
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.100')}
          mb={4}
        >
          <Text fontWeight="bold">University of Exeter</Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
            BSc Computer Science • 2024 - Present
          </Text>
          <Badge mt={2} colorScheme="cyan" variant="outline">Docker Certified</Badge>
        </Box>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          Timeline
        </Heading>
        <BioSection>
          <BioYear>2006</BioYear>
          Born in Madrid, Spain
        </BioSection>
        <BioSection>
          <BioYear>2021</BioYear>
          Founded robotics company
        </BioSection>
        <BioSection>
          <BioYear>2022</BioYear>
          Started Extended Project Qualification (EPQ) on ML for agriculture
        </BioSection>
        <BioSection>
          <BioYear>2023</BioYear>
          Began web development journey
        </BioSection>
        <BioSection>
          <BioYear>2024</BioYear>
          Graduated from Hastings School, started at University of Exeter
        </BioSection>
      </Section>

      <Section delay={0.35}>
        <Heading as="h3" variant="section-title">
          Hackathons & Achievements
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Box 
            p={4} 
            borderRadius="md" 
            bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.100')}
            borderLeft="4px solid"
            borderColor="gold"
          >
            <Badge colorScheme="yellow" mb={2}>1st Place</Badge>
            <Text fontWeight="bold">Movember Hackathon</Text>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
              Built a skin cancer image classifier achieving 80% accuracy
            </Text>
          </Box>
          <Box 
            p={4} 
            borderRadius="md" 
            bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.100')}
            borderLeft="4px solid"
            borderColor="cyan.500"
          >
            <Badge colorScheme="cyan" mb={2}>Top 10</Badge>
            <Text fontWeight="bold">Nebrija Hacking Competition</Text>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
              Placed 10th out of 150 competitors
            </Text>
          </Box>
        </SimpleGrid>
      </Section>

      <Section delay={0.4}>
        <Heading as="h3" variant="section-title">
          Featured Projects
        </Heading>
        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          <GridItem
            href="/works/robot_dog"
            title="Spot Micro AI Dog"
            thumbnail={thumbInkdrop}
          >
            Autonomous robot with LIDAR navigation
          </GridItem>
          <GridItem
            href="/works/EPQ"
            title="ML Crop Prediction"
            thumbnail={thumbYouTube}
          >
            70.4% accuracy satellite telemetry model
          </GridItem>
        </SimpleGrid>
      </Section>

      <Section delay={0.45}>
        <Heading as="h3" variant="section-title">
          Interests
        </Heading>
        <Paragraph>
          Machine Learning, Robotics, Computer Architecture, Cryptocurrency Mining, 
          Mathematics, and Basketball.
        </Paragraph>
      </Section>

      <Section delay={0.5}>
        <Heading as="h3" variant="section-title">
          Connect With Me
        </Heading>
        <List spacing={2}>
          <ListItem>
            <Link href="https://github.com/MarcosAsh" target="_blank" isExternal>
              <Button
                variant="ghost"
                colorScheme="cyan"
                leftIcon={<IoLogoGithub />}
              >
                @MarcosAsh
                <ExternalLinkIcon mx="2px" ml={2} />
              </Button>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://marcos-ashton-personal-portfolio.netlify.app/" target="_blank" isExternal>
              <Button
                variant="ghost"
                colorScheme="cyan"
                leftIcon={<IoDocumentText />}
              >
                Portfolio Website
                <ExternalLinkIcon mx="2px" ml={2} />
              </Button>
            </Link>
          </ListItem>
        </List>

        <Divider my={6} />

        <Heading as="h3" variant="section-title">
          Get In Touch
        </Heading>
        <Text mb={4}>
          I am currently seeking internship opportunities in software development, 
          robotics, or machine learning. I am eligible to work in the UK under a Student Visa 
          (no sponsorship required for internships during studies).
        </Text>

        <Box align="center" my={4}>
          <Button
            as={Link}
            href="mailto:marcosashiglesias@gmail.com"
            leftIcon={<EmailIcon />}
            colorScheme="cyan"
            size="lg"
            _hover={{ textDecoration: 'none' }}
          >
            marcosashiglesias@gmail.com
          </Button>
        </Box>
        <Text fontSize="sm" textAlign="center" color={useColorModeValue('gray.500', 'gray.500')}>
          Phone: +34 655 59 59 79
        </Text>
      </Section>
    </Container>
  </Layout>
)

export default Home
export { getServerSideProps } from '../components/chakra'
