import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Personal Portfolio Website">
    <Container>
      <Title>
        Personal Portfolio Website <Badge>Summer 2023 - Present</Badge>
      </Title>
      <P>
        Built and deployed a responsive personal portfolio website showcasing technical projects, 
        hackathon achievements, and professional experience. The site features modern design 
        principles, smooth animations, and 3D graphics.
      </P>
      <P>
        Integrated 3D animations using Three.js to create an engaging and interactive user 
        experience. The website is fully responsive, optimized for performance, and hosted 
        on Netlify for reliable, fast global access.
      </P>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Windows/macOS/Linux/iOS/Android</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Next.js, Chakra UI, Three.js, Framer Motion</span>
        </ListItem>
        <ListItem>
          <Meta>Features</Meta>
          <span>Responsive design, 3D animations, Dark/Light mode, SEO optimized</span>
        </ListItem>
        <ListItem>
          <Meta>Deployed by</Meta>
          <Link href="https://www.netlify.com/">
            Netlify
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Live Site</Meta>
          <Link href="https://marcos-ashton-personal-portfolio.netlify.app/">
            marcos-ashton-personal-portfolio.netlify.app
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Source Code</Meta>
          <Link href="https://github.com/MarcosAsh/personal_porfolio_websites">
            GitHub Repository <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <P>
        The website demonstrates modern web development practices including:
      </P>
      <List ml={4} my={4} styleType="disc">
        <ListItem>Server-side rendering with Next.js for optimal performance</ListItem>
        <ListItem>Component-based architecture using React</ListItem>
        <ListItem>Smooth animations with Framer Motion</ListItem>
        <ListItem>3D graphics and interactive elements using Three.js</ListItem>
        <ListItem>Responsive design with Chakra UI</ListItem>
        <ListItem>Accessibility and SEO best practices</ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'