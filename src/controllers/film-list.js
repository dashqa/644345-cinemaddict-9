import FilmController from './film';

class FilmListController {
  constructor(container, onDataChange, onCommentsChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._onCommentsChangeMain = onCommentsChange;
    this._subscriptions = [];
    this._films = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onCommentsChange = this._onCommentsChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  set(films) {
    this._films = films;
    this._subscriptions = [];

    this._container.innerHTML = ``;
    this._films.forEach((film) => this._render(film));
  }

  add(films) {
    films.forEach((film) => this._render(film));
    this._films = [...this._films, ...films];
  }

  _render(film) {
    const filmController = new FilmController(this._container, film, this._onChangeView, this._onDataChange, this._onCommentsChange);
    this._subscriptions.push(filmController.setView.bind(filmController));
  }

  _onDataChange(newFilmData) {
    this._onDataChangeMain(newFilmData);
  }

  _onCommentsChange(commentActivity) {
    return this._onCommentsChangeMain(commentActivity);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}

export default FilmListController;
