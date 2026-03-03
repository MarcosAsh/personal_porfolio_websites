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
import { IoLogoLinkedin, IoLogoGithub, IoDocumentText } from 'react-icons/io5'
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
          Second-Year Computer Science Student at University of Exeter
        </Text>
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} mt={1}>
          Open Source Contributor (Keras) | Full-Stack Developer | ML Researcher
        </Text>
      </Box>

      <Box display={{ md: 'flex' }}>
        <Box flexGrow={1}>
          <Heading as="h2" variant="page-title">
            Marcos Ashton Iglesias
          </Heading>
          <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')} mt={1}>
            Developer | Open Source Contributor | ML Researcher
          </Text>
          <Box mt={2}>
            <Badge colorScheme="green" mr={2}>Keras Contributor</Badge>
            <Badge colorScheme="blue">GSoC 2026 Applicant</Badge>
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
          I am a second-year Computer Science student at the University of Exeter
          with a first-class average. Born in Madrid, I am a Spanish citizen studying
          in the UK. My work spans open source contributions, machine learning research,
          and full-stack development.
        </Paragraph>
        <Paragraph>
          I have contributed 15+ merged PRs to Keras (Google), implementing new layers
          and operations across the PyTorch, JAX, and MLX backends. I am currently
          applying to Google Summer of Code 2026 with FFmpeg and the Rust Foundation,
          and working as a software development intern at Klonvar building a real estate
          web application.
        </Paragraph>
        <Box align="center" my={4}>
          <Button
            as="a"
            href="#projects"
            rightIcon={<ChevronRightIcon />}
            colorScheme="cyan"
          >
            View My Projects
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
            <WrapItem><SkillBadge>Rust</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>TypeScript</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Go</SkillBadge></WrapItem>
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
            <WrapItem><SkillBadge>Keras</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>TensorFlow</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>PyTorch</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Next.js</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>React</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Prisma</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Chakra UI</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Scikit-learn</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>Docker</SkillBadge></WrapItem>
            <WrapItem><SkillBadge>AWS</SkillBadge></WrapItem>
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
            <WrapItem><SkillBadge>Spanish (Native)</SkillBadge></WrapItem>
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
            BSc Computer Science | 2024 - Present | First-Class Average
          </Text>
          <Wrap mt={2} spacing={2}>
            <WrapItem><Badge colorScheme="cyan" variant="outline">Docker Certified</Badge></WrapItem>
            <WrapItem><Badge colorScheme="orange" variant="outline">Currently Learning Rust</Badge></WrapItem>
          </Wrap>
        </Box>
      </Section>

      <Section delay={0.28}>
        <Heading as="h3" variant="section-title">
          Experience
        </Heading>
        <Box
          p={4}
          borderRadius="md"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.100')}
          mb={4}
          borderLeft="4px solid"
          borderColor="cyan.500"
        >
          <Text fontWeight="bold">Klonvar — Software Development Intern</Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
            2025 - Present | Next.js, TypeScript, Prisma, Chakra UI
          </Text>
          <Text fontSize="sm" mt={2}>
            Building a real estate web application. Built client portal with messaging
            system and email notifications.
          </Text>
        </Box>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          Open Source
        </Heading>
        <Box
          p={4}
          borderRadius="md"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.100')}
          mb={4}
          borderLeft="4px solid"
          borderColor="green.500"
        >
          <Text fontWeight="bold">Keras (Google) — 15+ Merged PRs</Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
            GRU/LSTM layers, SSIM, distance transform, B-spline interpolation, bug fixes, testing
          </Text>
        </Box>
        <Box
          p={4}
          borderRadius="md"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.100')}
          mb={4}
          borderLeft="4px solid"
          borderColor="yellow.500"
        >
          <Text fontWeight="bold">GSoC 2026 Applicant</Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
            FFmpeg (FATE test coverage) | Rust Foundation (cargo-semver-checks lints)
          </Text>
        </Box>
        <Box align="center" my={4}>
          <Button
            as={NextLink}
            href="/works/keras"
            scroll={false}
            rightIcon={<ChevronRightIcon />}
            colorScheme="cyan"
            variant="outline"
            size="sm"
            mr={2}
          >
            Keras Details
          </Button>
          <Button
            as={NextLink}
            href="/works/gsoc"
            scroll={false}
            rightIcon={<ChevronRightIcon />}
            colorScheme="cyan"
            variant="outline"
            size="sm"
          >
            GSoC Details
          </Button>
        </Box>
      </Section>

      <Section delay={0.33}>
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
        <BioSection>
          <BioYear>2025</BioYear>
          Started contributing to Keras (Google), began Klonvar internship
        </BioSection>
        <BioSection>
          <BioYear>2026</BioYear>
          Applying to GSoC 2026 (FFmpeg, Rust Foundation), building LLMs Unlocked framework
        </BioSection>
      </Section>

      <Section delay={0.36}>
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
        <Heading as="h3" variant="section-title" id="projects">
          Projects
        </Heading>

        <Box mb={4}>
          <Text fontWeight="semibold" mb={2} fontSize="sm" color="cyan.500">
            Featured
          </Text>
          <List spacing={1} ml={2}>
            <ListItem>
              <Link as={NextLink} href="/works/llms_unlocked" color={useColorModeValue('gray.800', 'whiteAlpha.900')} _hover={{ color: 'cyan.500' }}>
                LLMs Unlocked
              </Link>
              {' '}<Link href="https://frontend-marcosashs-projects.vercel.app/" isExternal fontSize="xs" color="cyan.500">Live Demo <ExternalLinkIcon mx="1px" /></Link>
            </ListItem>
            <ListItem>
              <Link as={NextLink} href="/works/robot_dog" color={useColorModeValue('gray.800', 'whiteAlpha.900')} _hover={{ color: 'cyan.500' }}>
                Spot Micro AI Dog
              </Link>
            </ListItem>
            <ListItem>
              <Link as={NextLink} href="/works/fluid_sim" color={useColorModeValue('gray.800', 'whiteAlpha.900')} _hover={{ color: 'cyan.500' }}>
                Fluid Dynamics Simulation
              </Link>
              {' '}<Link href="https://fluid-sim-frontend.vercel.app/" isExternal fontSize="xs" color="cyan.500">Live Demo <ExternalLinkIcon mx="1px" /></Link>
            </ListItem>
            <ListItem>
              <Link as={NextLink} href="/works/chess_engine" color={useColorModeValue('gray.800', 'whiteAlpha.900')} _hover={{ color: 'cyan.500' }}>
                Chess Engine
              </Link>
            </ListItem>
            <ListItem>
              <Link as={NextLink} href="/works/interpreter_in_go" color={useColorModeValue('gray.800', 'whiteAlpha.900')} _hover={{ color: 'cyan.500' }}>
                Interpreter in Go
              </Link>
            </ListItem>
          </List>
        </Box>

        <Box mb={4}>
          <Text fontWeight="semibold" mb={2} fontSize="sm" color="cyan.500">
            Open Source
          </Text>
          <List spacing={1} ml={2}>
            <ListItem>
              <Link as={NextLink} href="/works/keras" color={useColorModeValue('gray.800', 'whiteAlpha.900')} _hover={{ color: 'cyan.500' }}>
                Keras (Google)
              </Link>
            </ListItem>
            <ListItem>
              <Link as={NextLink} href="/works/gsoc" color={useColorModeValue('gray.800', 'whiteAlpha.900')} _hover={{ color: 'cyan.500' }}>
                Google Summer of Code 2026
              </Link>
            </ListItem>
          </List>
        </Box>

        <Box mb={4}>
          <Text fontWeight="semibold" mb={2} fontSize="sm" color="cyan.500">
            Experience
          </Text>
          <List spacing={1} ml={2}>
            <ListItem>
              <Link as={NextLink} href="/works/klonvar" color={useColorModeValue('gray.800', 'whiteAlpha.900')} _hover={{ color: 'cyan.500' }}>
                Klonvar (Internship)
              </Link>
            </ListItem>
          </List>
        </Box>

        <Box mb={4}>
          <Text fontWeight="semibold" mb={2} fontSize="sm" color="cyan.500">
            Academic
          </Text>
          <List spacing={1} ml={2}>
            <ListItem>
              <Link as={NextLink} href="/works/knee_oa" color={useColorModeValue('gray.800', 'whiteAlpha.900')} _hover={{ color: 'cyan.500' }}>
                Knee OA Grading (AI)
              </Link>
            </ListItem>
            <ListItem>
              <Link as={NextLink} href="/works/ad_review" color={useColorModeValue('gray.800', 'whiteAlpha.900')} _hover={{ color: 'cyan.500' }}>
                Automatic Differentiation Review
              </Link>
            </ListItem>
            <ListItem>
              <Link as={NextLink} href="/works/EPQ" color={useColorModeValue('gray.800', 'whiteAlpha.900')} _hover={{ color: 'cyan.500' }}>
                Satellite Crop Prediction
              </Link>
            </ListItem>
          </List>
        </Box>

      </Section>

      <Section delay={0.45}>
        <Heading as="h3" variant="section-title">
          Interests
        </Heading>
        <Paragraph>
          Machine Learning, Open Source, Robotics, Systems Programming, Rust,
          Computer Architecture, Mathematics, and Basketball.
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
          I am open to opportunities in software development, open source, and
          machine learning. Spanish citizen eligible to work in the UK under
          a Student Visa.
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
