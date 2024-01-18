const fs = require('fs-extra');
const { marked } = require('marked');

function generateManifest(root) {
  const { version } = fs.readJsonSync(`${root}/package.json`);
  const manifest = fs.readJsonSync(`${root}/manifest.json`);

  return {
    ...manifest,
    date: Date.now(),
    version,
  };
}

function stripGitHubReferences(str) {
  const matches = str.match(/(.+)\(\[\w+]\(.+\)$/);

  const textOnlyMatch = matches?.[1];

  if (textOnlyMatch) return textOnlyMatch.trim();

  console.warn(`Update in unexpected format: ${str}`);

  return str;
}


function generateUpdates(root) {
  const markdown = fs.readFileSync(`${root}/CHANGELOG.md`, 'utf8');
  const tokens = marked.lexer(markdown);
  const updates = [];
  let currentUpdate = {};
  let currentUpdateItemType = 'features';

  tokens.forEach(token => {
    switch (token.type) {
      case 'heading':
        // Update heading
        if (token.depth === 2) {

          const matches = token.text.match(/(\d+\.\d+\.\d+).+(\d{4}-\d{2}-\d{2})/);
          const [match, version, date] = matches;

          currentUpdate = { version, date };
          updates.push(currentUpdate);
        }

        // Update type heading
        if (token.depth === 3) {
          if (token.text === 'Features') {
            currentUpdateItemType = 'features';
          }

          else if (token.text.includes('Fixes')) {
            currentUpdateItemType = 'fixes';
          }

          else {
            currentUpdateItemType = null;
          }
        }

        break;
      case 'list':
        if (!currentUpdateItemType) return;

        currentUpdate[currentUpdateItemType] = token.items.map(item => stripGitHubReferences(item.text))
    }
  });

  return updates;
}

module.exports = function manifestPlugin(root = process.cwd()) {
  return {
    name: 'manifest',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        switch (req.url) {
          case 'manifest.json':
            const manifest = JSON.stringify(generateManifest(root));
            return res.end(manifest);
          case 'updates.json':
            const updates = JSON.stringify(generateUpdates(root));
            return res.end(updates);

          default:
            return next();
        }
      });
    },
    writeBundle({ dir }) {
      const manifest = generateManifest(root);
      const updates = generateUpdates(root);

      fs.writeJsonSync(`${dir}/manifest.json`, manifest);
      fs.writeJsonSync(`${dir}/updates.json`, updates);
    }
  };
}
