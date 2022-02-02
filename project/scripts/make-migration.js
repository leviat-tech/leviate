const fs = require('fs');


function makeMigration() {
  const newMigrationName = process.argv[2];
  if (!newMigrationName) {
    console.log('make-migration requires a name as an argument');
    return;
  }
  if (newMigrationName.includes('.')) {
    console.log('migration names can\'t contain "."');
    return;
  }
  const migrationDirectory = 'src/migrations';
  const migrations = fs.readdirSync(migrationDirectory).filter((file) => file.includes('.migration.js'));
  if (migrations.find((migration) => migration.split('.')[1] === newMigrationName)) {
    console.log(`${newMigrationName} already exists`);
    return;
  }
  const newMigrationIndex = migrations.length;
  const newFileName = `${newMigrationIndex}.${newMigrationName}.migration.js`;
  const newFileContents = `function up(migration) {

}

function down(migration) {

}

export default {
  name: '${newMigrationName}',
  up,
  down,
};
`;
  fs.writeFileSync(`${migrationDirectory}/${newFileName}`, newFileContents);
}

makeMigration();
require('./generate-migration-index'); // janky way to run generate-migration-index;
