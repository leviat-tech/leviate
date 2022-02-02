const fs = require('fs');

function generateMigrationIndex() {
  const migrationDirectory = 'src/migrations';
  const migrations = fs.readdirSync(migrationDirectory)
    .filter((filename) => filename.includes('.migration.js'))
    .map((filename) => ({
      path: `./${filename.replace('.js', '')}`,
      index: filename.split('.')[0],
      alias: `m${filename.split('.')[0]}`,
      name: filename.split('.')[1],
    }))
    .sort((a, b) => a.index - b.index)
    .map((migration, idx, arr) => ({
      ...migration,
      prev: arr[idx - 1] && `m${idx - 1}`,
      next: arr[idx + 1] && `m${idx + 1}`,
    }));

  const imports = migrations.map(({ alias, path }) => `import ${alias} from '${path}';\n`).join('');
  const exports = migrations
    .map(({ name, alias, prev, next }) => `  ['${name}']: { ...${alias}, prev: ${prev}, next: ${next} }`) // eslint-disable-line
    .join(',\n');
  const indexContents = `${imports}\n\nexport default {\n${exports},\n};\n`;
  fs.writeFileSync(`${migrationDirectory}/index.js`, indexContents);
}

generateMigrationIndex();
