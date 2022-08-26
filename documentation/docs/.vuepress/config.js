module.exports = {
  title: 'Leviate',
  description: 'Documentation for the Leviate framework',
  themeConfig: {
    repo: 'https://github.com/leviat-tech/leviate',
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'CLI', link: '/cli' },
      { text: 'Guide', link: '/guide' },
      { text: 'Structure', link: '/structure' },
      { text: 'Config', link: '/config' },
    ],
    smoothScroll: true,
    // displayAllHeaders: true,
    sidebarDepth: 2,
    sidebar: {
      '/': [
        '/',
        '/getting-started',
        '/guide',
        '/directory-structure',
        '/cli',
        '/core',
      ]
    }
  },
}