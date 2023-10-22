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
        Hello I'am a Spanish developer
      </Box>

      <Box display={{ md: 'flex' }}>
        <Box flexGrow={1}>
          <Heading as="h2" variant="page-title">
            Marcos Ashton
          </Heading>
          <p>Student and programmer </p>
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
          Work
        </Heading>
        <Paragraph>
          Iam a student and programmer proficient in Unity, React, Flask, Python, TensorFlow
           and next.js. I am also a founder of a robotics company
          currently protoyping a quadraped robot with great prospects in the private field. You can see my robot here: {' '}
          <Link as={NextLink} href="/works/robot_dog" passHref scroll={false}>
            Robot dog
          </Link>
          . You can also view my EPQ (extended project qualification) here: "
          <Link as={NextLink} href="/works/EPQ" passHref scroll={false}>
            EPQ
          </Link>
          &quot; which has a series of applications in the agricultural secter.
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
          Started my EPQ
        </BioSection>
        <BioSection>
          <BioYear>2023 to present</BioYear>
          Started making Websites
        </BioSection>
        <BioSection>
          <BioYear>2024</BioYear>
          Graduated from Hastings School
        </BioSection>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          My passions
        </Heading>
        <Paragraph>
          Machine learning, Computer Hardware, Crypto mining, Mathematics, Computer architecture, Computer science,
          Robotics and Basketball.
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
            href="works\inkdrop"
            title="EPQ"
            thumbnail={thumbYouTube}
          >
            My Extended Project Qualification
          </GridItem>
          <GridItem
            href="works\fourpainters"
            title="Robotics Company"
            thumbnail={thumbInkdrop}
          >
            A ground-breaking quadraped design
          </GridItem>
        </SimpleGrid>

        <Heading as="h3" variant="section-title">
          Contact me
        </Heading>
        <p>
          If you have any questions please contact me.
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
