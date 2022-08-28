module.exports = {
  title: 'Leviate',
  description: 'Documentation for the Leviate framework',
  themeConfig: {
    repo: 'https://github.com/leviat-tech/leviate',
    logo: '/logo.png',
    nav: [
      // { text: 'Home', link: '/' },
      // { text: 'CLI', link: '/cli' },
      // { text: 'Guide', link: '/guide' },
      // { text: 'Structure', link: '/directory-structure' },
      // { text: 'Config', link: '/config' },
      // { text: 'Core', link: '/core' },
    ],
    smoothScroll: true,
    // displayAllHeaders: true,
    sidebarDepth: 2,
    sidebar: {
      '/': [
        '/',
        '/getting-started',
        '/cli',
        '/guide',
        '/directory-structure',
        '/config',
        '/core',
        '/style-guide'
      ]
    }
  },
}
