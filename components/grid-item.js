import NextLink from 'next/link'
import Image from 'next/image'
import { Box, Text, LinkBox, LinkOverlay, useColorModeValue } from '@chakra-ui/react'
import { Global } from '@emotion/react'

export const GridItem = ({ children, href, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <LinkBox cursor="pointer">
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title}
          className="grid-item-thumbnail"
          placeholder="blur"
          loading="lazy"
        />
      ) : (
        <PlaceholderThumbnail title={title} />
      )}
      <LinkOverlay href={href} target="_blank">
        <Text mt={2}>{title}</Text>
      </LinkOverlay>
      <Text fontSize={14}>{children}</Text>
    </LinkBox>
  </Box>
)

const PlaceholderThumbnail = ({ title }) => {
  const bg = useColorModeValue('cyan.50', 'cyan.900')
  const color = useColorModeValue('cyan.700', 'cyan.200')
  return (
    <Box
      className="grid-item-thumbnail"
      bg={bg}
      color={color}
      h="140px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="sm"
      fontWeight="semibold"
      px={4}
    >
      {title}
    </Box>
  )
}

export const WorkGridItem = ({ children, id, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <LinkBox
      as={NextLink}
      href={`/works/${id}`}
      scroll={false}
      cursor="pointer"
    >
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title}
          className="grid-item-thumbnail"
          placeholder="blur"
        />
      ) : (
        <PlaceholderThumbnail title={title} />
      )}
      <LinkOverlay as="div" href={`/works/${id}`}>
        <Text mt={2} fontSize={20}>
          {title}
        </Text>
      </LinkOverlay>
      <Text fontSize={14}>{children}</Text>
    </LinkBox>
  </Box>
)

export const GridItemStyle = () => (
  <Global
    styles={`
      .grid-item-thumbnail {
        border-radius: 12px;
      }
    `}
  />
)
