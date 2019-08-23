import DefaultComponent from './default-component';

class FilmSection extends DefaultComponent {
  constructor({title, isExtra}) {
    super();
    this._title = title;
    this._isExtra = isExtra;
  }

  getTemplate() {
    return `
      <section class="${this._isExtra ? `films-list--extra` : `films-list`}">
        <h2 class="films-list__title ${!this._isExtra ? `visually-hidden` : ``}">
          ${this._title}
        </h2>
        <div class="films-list__container"></div>
        ${!this._isExtra ? `<button class="films-list__show-more">Show more</button>` : ``}
      </section>
    `.trim();
  }
}

export default FilmSection;
