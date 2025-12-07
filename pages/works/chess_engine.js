import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Heading,
  Text,
  Box,
  useColorModeValue
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Chess Engine">
    <Container>
      <Title>
        Chess Engine <Badge>2024</Badge>
      </Title>
      
      <P>
        A chess engine developed from scratch in C++ that achieved an 800 rating on 
        Lichess. The project demonstrates understanding of game theory, algorithm 
        optimization, and efficient data structure implementation.
      </P>

      <Box 
        p={4} 
        my={4} 
        borderRadius="md" 
        bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
        borderLeft="4px solid"
        borderColor="cyan.500"
      >
        <Heading as="h4" size="sm" mb={2}>Key Features</Heading>
        <List spacing={1} fontSize="sm">
          <ListItem>• Complete chess rule implementation including castling and en passant</ListItem>
          <ListItem>• Move evaluation using piece-square tables</ListItem>
          <ListItem>• Alpha-beta pruning for search tree optimization</ListItem>
          <ListItem>• Achieved 800 rating on Lichess</ListItem>
        </List>
      </Box>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Windows/macOS/Linux</span>
        </ListItem>
        <ListItem>
          <Meta>Language</Meta>
          <span>C++</span>
        </ListItem>
        <ListItem>
          <Meta>Rating</Meta>
          <span>800 on Lichess</span>
        </ListItem>
        <ListItem>
          <Meta>Lichess</Meta>
          <Link href="https://lichess.org/" target="_blank">
            lichess.org <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Technical Implementation
      </Heading>
      
      <P>
        The engine uses a bitboard representation for efficient board state manipulation, 
        allowing for fast move generation and position evaluation. The search algorithm 
        implements minimax with alpha-beta pruning to explore the game tree efficiently.
      </P>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Algorithms & Techniques
      </Heading>
      
      <List ml={6} my={2} spacing={1}>
        <ListItem>• <strong>Minimax Algorithm:</strong> Core decision-making for optimal move selection</ListItem>
        <ListItem>• <strong>Alpha-Beta Pruning:</strong> Reduces search space by eliminating branches</ListItem>
        <ListItem>• <strong>Move Ordering:</strong> Prioritizes captures and checks for better pruning</ListItem>
        <ListItem>• <strong>Piece-Square Tables:</strong> Position-based evaluation heuristics</ListItem>
        <ListItem>• <strong>Bitboard Representation:</strong> Efficient 64-bit board state encoding</ListItem>
      </List>

      <Heading as="h4" size="md" mt={6} mb={3}>
        Future Improvements
      </Heading>
      
      <P>
        Planned enhancements include implementing transposition tables for position caching, 
        adding an opening book database, implementing iterative deepening, and exploring 
        neural network-based evaluation functions similar to those used in modern engines.
      </P>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
