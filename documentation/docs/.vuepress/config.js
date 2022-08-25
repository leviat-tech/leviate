module.exports = {
  title: 'Leviate',
  description: 'Documentation for the Leviate framework',
  themeConfig: {
    repo: 'https://github.com/leviat-tech/leviate',
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'CLI', link: '/cli' },
      { text: 'Features', link: '/features' },
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
        '/cli',
        '/configuration',
        '/directory-structure',
        '/core',
      ]
    }
  },
}