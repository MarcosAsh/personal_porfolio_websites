import Head from 'next/head'
import dynamic from 'next/dynamic'
import NavBar from '../navbar'
import { Box, Container } from '@chakra-ui/react'
import Footer from '../footer'
import VoxelDogLoader from '../voxel-dog-loader'

const LazyVoxelDog = dynamic(() => import('../voxel-dog'), {
  ssr: false,
  loading: () => <VoxelDogLoader />
})

const Main = ({ children, router }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Marcos Ashton Iglesias - Computer Science Student at University of Exeter | Robotics, Machine Learning, and Full-Stack Development" />
        <meta name="author" content="Marcos Ashton Iglesias" />
        <meta name="keywords" content="Marcos Ashton, Computer Science, University of Exeter, Robotics, Machine Learning, Python, C++, Web Development" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta property="og:site_name" content="Marcos Ashton Iglesias" />
        <meta name="og:title" content="Marcos Ashton Iglesias - Computer Science Student & Developer" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Portfolio of Marcos Ashton Iglesias - Computer Science student specializing in robotics, machine learning, and full-stack development." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Marcos Ashton Iglesias - Portfolio" />
        <meta name="twitter:description" content="Computer Science student at University of Exeter specializing in robotics and machine learning." />
        <title>Marcos Ashton Iglesias - Portfolio</title>
      </Head>

      <NavBar path={router.asPath} />

      <Container maxW="container.md" pt={14}>
        <LazyVoxelDog />

        {children}

        <Footer />
      </Container>
    </Box>
  )
}

export default Main
