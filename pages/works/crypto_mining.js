import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Heading,
  Box,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Cryptocurrency Mining">
    <Container>
      <Title>
        Cryptocurrency Mining Operation <Badge>2021 - Present</Badge>
      </Title>
      
      <P>
        A comprehensive cryptocurrency mining operation utilizing multiple ASIC 
        and GPU miners. This project provided hands-on experience with hardware 
        management, network infrastructure, power distribution, and thermal management.
      </P>

      <Box 
        p={4} 
        my={4} 
        borderRadius="md" 
        bg={useColorModeValue('yellow.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="yellow.500"
      >
        <Heading as="h4" size="sm" mb={2}>Technical Skills Gained</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Hardware configuration and optimization</ListItem>
          <ListItem>• Network infrastructure setup</ListItem>
          <ListItem>• Power distribution and electrical planning</ListItem>
          <ListItem>• Thermal management solutions</ListItem>
          <ListItem>• Remote monitoring and management</ListItem>
        </List>
      </Box>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Mining Equipment
      </Heading>

      <TableContainer my={4}>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Equipment</Th>
              <Th>Hashrate</Th>
              <Th>Algorithm</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Bitmain Antminer KS3</Td>
              <Td>8.3 TH/s</Td>
              <Td>KHeavyHash</Td>
            </Tr>
            <Tr>
              <Td>Jasminer X16-P</Td>
              <Td>-</Td>
              <Td>Ethash</Td>
            </Tr>
            <Tr>
              <Td>Bitmain Antminer L7 (x3)</Td>
              <Td>9.05 GH/s each</Td>
              <Td>Scrypt</Td>
            </Tr>
            <Tr>
              <Td>5x RTX 3060 Ti GPU Rig</Td>
              <Td>-</Td>
              <Td>KASPOW</Td>
            </Tr>
            <Tr>
              <Td>Goldshell ST-BOX</Td>
              <Td>-</Td>
              <Td>-</Td>
            </Tr>
            <Tr>
              <Td>iPollo G1</Td>
              <Td>-</Td>
              <Td>-</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Software</Meta>
          <span>Hive OS, NiceHash, EasyMiner</span>
        </ListItem>
        <ListItem>
          <Meta>Management</Meta>
          <span>Remote monitoring, automated alerts</span>
        </ListItem>
        <ListItem>
          <Meta>Resource</Meta>
          <Link href="https://www.youtube.com/@RedPandaMining" target="_blank">
            Red Panda Mining <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Last Update</Meta>
          <span>2023</span>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Infrastructure Challenges
      </Heading>
      
      <P>
        Managing a mining operation requires solving complex engineering challenges:
      </P>
      
      <List ml={6} my={2} spacing={1}>
        <ListItem>• Electrical capacity planning and circuit distribution</ListItem>
        <ListItem>• Heat dissipation and cooling solutions</ListItem>
        <ListItem>• Network reliability and redundancy</ListItem>
        <ListItem>• Noise management</ListItem>
        <ListItem>• Firmware updates and optimization</ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Lessons Learned
      </Heading>
      
      <P>
        This project taught valuable lessons about hardware at scale, the importance 
        of reliable infrastructure, and the economics of computational resources. 
        These skills translate directly to managing server infrastructure and 
        understanding distributed computing systems.
      </P>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
