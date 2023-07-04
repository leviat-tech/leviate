import fs from 'fs-extra';
import { marked } from 'marked';

function generateManifest(root) {
  const { version } = fs.readJsonSync(`${root}/package.json`);
  const manifest = fs.readJsonSync(`${root}/manifest.json`);

  return JSON.stringify({
    ...manifest,
    date: Date.now(),
    version,
  }, null, '  ');
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

          if (token.text === 'Bug Fixes') {
            currentUpdateItemType = 'fixes';
          }
        }

        break;
      case 'list':
        currentUpdate[currentUpdateItemType] = token.items.map(item => {
          return item.text.match(/(.+)\(.+\)$/)[1];
        });
    }
  });

  console.log(updates);

  return JSON.stringify(updates, null, '  ');
}

export default function manifestPlugin(root = process.cwd()) {
  return {
    name: 'manifest',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        switch (req.url) {
          case '/manifest.json':
            const manifest = generateManifest(root);
            return res.end(manifest);
          case '/updates.json':
            const updates = generateUpdates(root);
            return res.end(updates);

          default:
            return next();
        }
      });
    }
  };
}