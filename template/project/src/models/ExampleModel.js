import BaseModel from '@crhio/leviate/BaseModel';
// import { Entity } from 'normie'

class ExampleModel extends BaseModel {
  static id = 'rectangles'

  static get fields() {
    if (!this.useStore) return {};

    return {
      name: `Rectangle ${this.read().length +1}`,
      width: Math.round(Math.random() * 200) + 50,
      height: Math.round(Math.random() * 200) + 50,
      depth: Math.round(Math.random() * 200) + 50,
    };
  }
}

export default ExampleModel;
