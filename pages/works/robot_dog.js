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
  <Layout title="Robot dog">
    <Container>
      <Title>
        Robot dog <Badge>September 2022 - Ongoing</Badge>
      </Title>
      <P>
        A quadruped robot that uses Nvidia Jetson Nano to process the environment
        in real time.
      </P>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Stack</Meta>
          <span>DeepLearning, Tensorflow, Pybullet, adafruit</span>
        </ListItem>
        <ListItem>
          <Meta>Website</Meta>
          <Link href="">
            The Notion-made website where I explain the project
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Github (Simulation)</Meta>
          <Link href="https://github.com/MarcosAsh/Robot_Dog_Simulation">
            The robots dog simulation <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Github (softwarte)</Meta>
          <Link href="https://github.com/MarcosAsh/Robot_Dog">
            software for the robot dog's functionality
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>notice</Meta>
          <P>
            Notice that the Github is private as it took a lot of work and I
            believe it could be commercially viable if interested in details, I am
            more than happy to explain. Just contact my email address, found at
            bottom of this website.
          </P>
        </ListItem>
      </List>
  
      <WorkImage src="/images/works/robot_dog1.png" alt="robotdog"/>
      <WorkImage src="/images/robot_dog.png" alt="robotdog" />
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
