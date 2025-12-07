import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const styles = {
  global: props => ({
    body: {
      bg: mode('#f8f9fa', '#1a1a2e')(props),
      color: mode('#2d3748', '#e2e8f0')(props)
    }
  })
}

const components = {
  Heading: {
    variants: {
      'section-title': {
        textDecoration: 'underline',
        fontSize: 20,
        textUnderlineOffset: 6,
        textDecorationColor: '#0ea5e9',
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 4
      },
      'page-title': {
        fontSize: { base: '2xl', md: '3xl' },
        fontWeight: 'bold',
        letterSpacing: '-0.02em'
      }
    }
  },
  Link: {
    baseStyle: props => ({
      color: mode('#0ea5e9', '#38bdf8')(props),
      textUnderlineOffset: 3,
      _hover: {
        textDecoration: 'underline',
        color: mode('#0284c7', '#7dd3fc')(props)
      }
    })
  },
  Button: {
    variants: {
      solid: props => ({
        bg: mode('#0ea5e9', '#0ea5e9')(props),
        color: 'white',
        _hover: {
          bg: mode('#0284c7', '#38bdf8')(props)
        }
      })
    }
  }
}

const fonts = {
  heading: "'M PLUS Rounded 1c', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
}

const colors = {
  grassTeal: '#0ea5e9',
  accent: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  }
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true
}

const theme = extendTheme({ config, styles, components, fonts, colors })
export default theme
