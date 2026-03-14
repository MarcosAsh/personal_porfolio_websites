import Parser from 'rss-parser'

const parser = new Parser()

export default async function handler(req, res) {
  try {
    const feed = await parser.parseURL('https://marcosashton.substack.com/feed')
    const articles = feed.items.slice(0, 5).map(item => ({
      title: item.title || '',
      link: item.link || '',
      date: item.pubDate
        ? new Date(item.pubDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        : '',
      excerpt: item.contentSnippet
        ? item.contentSnippet.substring(0, 150).trim() +
          (item.contentSnippet.length > 150 ? '...' : '')
        : ''
    }))
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.status(200).json({ articles })
  } catch {
    res.status(500).json({ articles: [] })
  }
}
