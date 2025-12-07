import { Container, Heading, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'

import thumbaiclub from '../public/images/aiclub.jpg'
import thumbrobotdog from '../public/images/robot_dog.png'
import thumbepq from '../public/images/EPQ.png'
import thumbwebsite from '../public/images/links/Current-website.jpg'

const Posts = () => (
  <Layout title="Websites">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Web Projects
      </Heading>
      
      <Text mb={6} color={useColorModeValue('gray.600', 'gray.400')}>
        A showcase of websites and web applications I have developed, ranging from 
        personal projects to collaborative efforts.
      </Text>

      <Section delay={0.1}>
        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          <GridItem
            title="Personal Portfolio"
            thumbnail={thumbwebsite}
            href="/works/Current_website"
          >
            This website - built with Next.js, Three.js, and Chakra UI
          </GridItem>
          <GridItem
            title="AI Club Website"
            thumbnail={thumbaiclub}
            href="/works/AIclub"
          >
            Interactive website with chatbot integration
          </GridItem>
          <GridItem
            title="Robot Dog Documentation"
            thumbnail={thumbrobotdog}
            href="/works/robot_dog"
          >
            Project documentation and showcase
          </GridItem>
          <GridItem
            title="EPQ Research Project"
            thumbnail={thumbepq}
            href="/works/EPQ"
          >
            Machine learning crop prediction research
          </GridItem>
        </SimpleGrid>
      </Section>
    </Container>
  </Layout>
)

export default Posts
export { getServerSideProps } from '../components/chakra'
