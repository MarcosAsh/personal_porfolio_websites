import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Heading,
  Box,
  useColorModeValue,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Work = () => (
  <Layout title="Satellite Telemetry for Crop Prediction">
    <Container>
      <Title>
        Satellite Telemetry for Crop Prediction <Badge>2022 - 2024</Badge>
      </Title>
      
      <P>
        An Extended Project Qualification (EPQ) research project that applies machine learning 
        to predict agricultural crop yields using historical satellite telemetry and weather 
        data. The project focused on avocado crop yields in California as a case study.
      </P>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} my={6}>
        <Stat 
          p={4} 
          borderRadius="md" 
          bg={useColorModeValue('green.50', 'whiteAlpha.100')}
          textAlign="center"
        >
          <StatNumber color="green.500">70.4%</StatNumber>
          <StatLabel>Model Accuracy</StatLabel>
          <StatHelpText>on test data</StatHelpText>
        </Stat>
        <Stat 
          p={4} 
          borderRadius="md" 
          bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
          textAlign="center"
        >
          <StatNumber color="blue.500">2+</StatNumber>
          <StatLabel>Data Sources</StatLabel>
          <StatHelpText>integrated</StatHelpText>
        </Stat>
        <Stat 
          p={4} 
          borderRadius="md" 
          bg={useColorModeValue('purple.50', 'whiteAlpha.100')}
          textAlign="center"
        >
          <StatNumber color="purple.500">18</StatNumber>
          <StatLabel>Months</StatLabel>
          <StatHelpText>of research</StatHelpText>
        </Stat>
      </SimpleGrid>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Python, TensorFlow, Scikit-learn, Pandas, NumPy, Seaborn, Matplotlib</span>
        </ListItem>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Cross-platform (Windows/macOS/Linux)</span>
        </ListItem>
        <ListItem>
          <Meta>GitHub</Meta>
          <Link href="https://github.com/MarcosAsh/EPQ_crop_yeild_AI" target="_blank">
            EPQ Crop Yield AI Repository <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Data Sources
      </Heading>
      
      <List ml={4} my={2} spacing={2}>
        <ListItem>
          <Meta>Agricultural</Meta>
          <Link href="https://www.fao.org/faostat/en/#data/QCL" target="_blank">
            FAOSTAT - Food and Agriculture Organization <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Climate</Meta>
          <Link href="https://climateknowledgeportal.worldbank.org/download-data" target="_blank">
            World Bank Climate Knowledge Portal <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Research</Meta>
          <Link href="https://foodsecurity-su.medium.com/satellite-yield-estimation-how-good-is-it-and-what-can-we-learn-18c6ef13f13d" target="_blank">
            Satellite Yield Estimation Research <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Methodology
      </Heading>
      
      <P>
        The project involved collecting and preprocessing historical satellite imagery data, 
        weather patterns, and agricultural yield records. Multiple machine learning models 
        were trained and compared, including neural networks and ensemble methods, to find 
        the optimal approach for yield prediction.
      </P>

      <Box 
        p={4} 
        my={4} 
        borderRadius="md" 
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="cyan.500"
      >
        <Heading as="h4" size="sm" mb={2}>Key Learnings</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Feature engineering from satellite imagery (NDVI, land surface temperature)</ListItem>
          <ListItem>• Time series analysis for seasonal agricultural patterns</ListItem>
          <ListItem>• Model selection and hyperparameter optimization</ListItem>
          <ListItem>• Data visualization and scientific communication</ListItem>
        </List>
      </Box>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Reference Material
      </Heading>
      
      <P>
        <Link href="https://www.youtube.com/watch?v=vGOvUoqn_M8" target="_blank">
          This tutorial video <ExternalLinkIcon mx="2px" />
        </Link>
        {' '}was instrumental in developing the machine learning pipeline for this project.
      </P>

      <WorkImage src="/images/works/EPQ_image1.jpg" alt="EPQ Data Visualization" />
      <WorkImage src="/images/works/EPQ_image2.jpg" alt="EPQ Model Results" />
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
