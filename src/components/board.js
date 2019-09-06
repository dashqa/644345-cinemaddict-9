import DefaultComponent from './default-component';

class Board extends DefaultComponent {

  getTemplate() {
    return `
      <section class="films"></section>`.trim();
  }
}

export default Board;
