import { useState, useEffect } from 'react'
import { Box, Text, Link, Skeleton, useColorModeValue } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

const SubstackFeed = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const cardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.100')
  const hoverBg = useColorModeValue('whiteAlpha.700', 'whiteAlpha.200')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')

  useEffect(() => {
    fetch('/api/feed')
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        setArticles(data.articles || [])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  if (error) {
    return (
      <Box p={4} borderRadius="md" bg={cardBg} textAlign="center">
        <Text fontSize="sm" color={mutedColor}>
          Unable to load articles.{' '}
          <Link
            href="https://marcosashton.substack.com"
            isExternal
            color="cyan.500"
          >
            Visit Substack directly <ExternalLinkIcon mx="1px" />
          </Link>
        </Text>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box>
        {[...Array(3)].map((_, i) => (
          <Box key={i} p={4} borderRadius="md" bg={cardBg} mb={3}>
            <Skeleton height="16px" width="60%" mb={2} />
            <Skeleton height="12px" width="30%" mb={2} />
            <Skeleton height="12px" width="90%" />
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box>
      {articles.map((article, i) => (
        <Link
          key={i}
          href={article.link}
          isExternal
          _hover={{ textDecoration: 'none' }}
        >
          <Box
            p={4}
            borderRadius="md"
            bg={cardBg}
            mb={3}
            _hover={{ bg: hoverBg }}
            transition="background 0.2s"
          >
            <Text fontWeight="bold" fontSize="sm">
              {article.title}
            </Text>
            <Text fontSize="xs" color={mutedColor} mb={1}>
              {article.date}
            </Text>
            <Text fontSize="sm" color={mutedColor} noOfLines={2}>
              {article.excerpt}
            </Text>
          </Box>
        </Link>
      ))}
    </Box>
  )
}

export default SubstackFeed
