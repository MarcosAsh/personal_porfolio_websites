import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'

import thumbaiclub from '../public/images/aiclub.jpg'
import thumbrobotdog from '../public/images/robot_dog.png'
import thumbepq from '../public/images/EPQ.png'
import thumbwebsite from '../public/images/links/Current-website.jpg'


const Posts = () => (
  <Layout title="Posts">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Websites
      </Heading>

      <Section delay={0.1}>
        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          <GridItem
            title="AI club"
            thumbnail={thumbaiclub}
            href=""
          />
          <GridItem
            title="Robot Dog"
            thumbnail={thumbrobotdog}
            href=""
          />
          <GridItem
            title="EPQ"
            thumbnail={thumbepq}
            href=""
          />
          <GridItem
            title="Current website"
            thumbnail={thumbwebsite}
            href=""
          />
        </SimpleGrid>
      </Section>



    </Container>
  </Layout>
)

export default Posts
export { getServerSideProps } from '../components/chakra'
