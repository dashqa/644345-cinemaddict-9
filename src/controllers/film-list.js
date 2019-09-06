import FilmController from './film';

class FilmListController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._subscriptions = [];
    this._films = [];

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  setFilms(films) {
    this._films = films;
    this._subscriptions = [];

    this._container.innerHTML = ``;
    this._films.forEach((film) => this._renderFilm(film));
  }

  addFilms(films) {
    films.forEach((film) => this._renderFilm(film));
    this._films = [...this._films, ...films];
  }

  _renderFilm(film) {
    const filmController = new FilmController(this._container, film, this._onChangeView, this._onDataChange);
    this._subscriptions.push(filmController.setDefaultView.bind(filmController));
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onDataChange(newFilmData, oldFilmData) {
    this._films[this._films.indexOf(oldFilmData)] = newFilmData;

    this.setFilms(this._films);
    this._onDataChangeMain(this._films);
  }
}

export default FilmListController;
