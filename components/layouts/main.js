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
        <meta name="description" content="Marcos Ashton Iglesias - Computer Science Student at University of Exeter | Keras Contributor, Open Source, Machine Learning, Full-Stack Development" />
        <meta name="author" content="Marcos Ashton Iglesias" />
        <meta name="keywords" content="Marcos Ashton, Computer Science, University of Exeter, Keras, Open Source, Machine Learning, Python, C++, Rust, Web Development" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta property="og:site_name" content="Marcos Ashton Iglesias" />
        <meta name="og:title" content="Marcos Ashton Iglesias - CS Student, Keras Contributor & Developer" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Portfolio of Marcos Ashton Iglesias - Keras contributor, GSoC 2026 applicant, and CS student at University of Exeter." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Marcos Ashton Iglesias - Portfolio" />
        <meta name="twitter:description" content="Keras contributor, GSoC 2026 applicant, and CS student at University of Exeter." />
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
