import {
  Container,
  Badge,
  Link,
  List,
  ListItem
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Kinematics">
    <Container>
      <Title>
        Kinematics for robot dog<Badge>2023</Badge>
      </Title>
      <P>
        Therse are the calculations for the kinematics of my robot dog.
      </P>
      <P>
        <Link href="https://www.youtube.com/watch?v=dHjWVlfNraM&ab_channel=TheOrganicChemistryTutor" target="_blank">
          I would like to thank Organic Chemistry Tutor as this video helped me to complete the project. <ExternalLinkIcon mx="2px" />
        </Link>
            These calculations are general so anybody who needs them is more than welcome to take them.
      </P>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Stack</Meta>
          <span>
            Pen and Paper / Kinematics
          </span>
        </ListItem>
        <ListItem>
          <Meta>Video</Meta>
          <Link href="https://www.youtube.com/watch?v=q9IWoQ199_o&ab_channel=LecturesbyWalterLewin.Theywillmakeyou%E2%99%A5Physics.">
            I would also like to highlight the importance of this video <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <WorkImage src="/images/works/kinematics1.jpeg" alt="Website" />

      <WorkImage src="/images/works/kinematics2.jpeg" alt="Website" />
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
