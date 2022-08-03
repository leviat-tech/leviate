// import BaseModel from '@crhio/leviate/BaseModel';
import { Entity } from 'normie'

class ExampleModel extends Entity {
  static id = 'rectangles'

  static get fields() {
    return {
      name: `Rectangle ${Math.random()}`,
      width: 200,
      height: 100,
    };
  }
}

export default ExampleModel;
