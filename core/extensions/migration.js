import { get, set, unset } from 'lodash-es';


class Migration {
  constructor(migrations, state) {
    this.migrations = migrations;
    this.state = state;
  }

  get isUpToDate() {
    return !this.currentMigration.next;
  }

  get currentMigrationName() {
    return this.state.serialization_version || 'initial';
  }

  get latestMigrationName() {
    return Object.values(this.migrations).find((migration) => !migration.next).name;
  }

  get currentMigration() {
    return this.migrations[this.currentMigrationName];
  }

  setProp = function setProp(prop, value) {
    set(this.state, prop, value);
  };

  removeProp = function removeProp(prop) {
    unset(this.state, prop);
  };

  renameProp = function renameProp(oldName, newName) {
    this.setProp(newName, get(this.state, oldName));
    this.removeProp(oldName);
  }

  next = function next() {
    if (this.isUpToDate) {
      console.log('already migrated to latest version');
      return;
    }
    this.currentMigration.next.up(this);
    this.state.serialization_version = this.currentMigration.next.name;
  };

  prev = function prev() {
    if (!this.currentMigration.prev) {
      console.log('cannot go backwards any further');
      return;
    }
    this.currentMigration.down(this);
    this.state.serialization_version = this.currentMigration.prev.name;
  };

  migrateToLatest = function migrateToLatest() {
    while (!this.isUpToDate) {
      this.next();
    }
    return this.state;
  };
}


export default Migration;
