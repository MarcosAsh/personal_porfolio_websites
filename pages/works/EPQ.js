import {
  Container,
  Badge,
  Link,
  List,
  ListItem
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Work = () => (
  <Layout title="EPQ">
    <Container>
      <Title>
        EPQ <Badge>September 2022 - May 2024</Badge>
      </Title>
      <P>
        This program predicts crop yield from data which is imported from websites
        such as the World Bank Group Climate Change knowledge protal and FAOSTAT.
        Which bothe give premade csv files.
      </P>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Website</Meta>
          <Link href="">
            To be made <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Windows/macOS/Linux/iOS/Android</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>TensorFlow, Python, Seaborn, matplotlib, pandas and numpy</span>
        </ListItem>
        <ListItem>
          <Meta>Video</Meta>
          <P>
            <Link href="https://www.youtube.com/watch?v=vGOvUoqn_M8&ab_channel=Artificialintelligence" target="_blank">
              This video was pivotal in the development of the project.<ExternalLinkIcon mx="2px" />
            </Link>
          </P>
        </ListItem>
        <ListItem>
          <Meta>Github</Meta>
          <P>
            <Link href="https://github.com/MarcosAsh/EPQ_crop_yeild_AI" target="_blank">
              This is the GitHub.<ExternalLinkIcon mx="2px" />
            </Link>
          </P>
        </ListItem>
        <ListItem>
          <Meta>Sources</Meta>
          <Link href="https://www.fao.org/faostat/en/#data/QCL">
            - FAOSTAT <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta></Meta>
          <Link href="https://climateknowledgeportal.worldbank.org/download-data">
            - Climate Knowledge Portal <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta></Meta>
          <Link href="https://foodsecurity-su.medium.com/satellite-yield-estimation-how-good-is-it-and-what-can-we-learn-18c6ef13f13d">
            - Satellite yield estimation: how good is it, and what can we learn? <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <WorkImage src="/images/works/EPQ_image1.jpg" alt="EPQ" />
      <WorkImage src="/images/works/EPQ_image2.jpg" alt="EPQ" />
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
