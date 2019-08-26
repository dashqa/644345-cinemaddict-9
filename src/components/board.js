import DefaultComponent from './default-component';

class Board extends DefaultComponent {
  constructor(filmsQuantity) {
    super();
    this._quantity = filmsQuantity;
  }

  getTemplate() {
    return `
      <section class="films">
        ${!this._quantity ? `<p>There are no movies in our database</p>`.trim() : ``}
      </section>`.trim();
  }
}

export default Board;
