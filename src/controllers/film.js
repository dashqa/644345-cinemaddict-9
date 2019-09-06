import FilmCard from './../components/film-card';
import FilmCardDetails from './../components/film-details';
import {render, unrender} from '../utils';
import {Position} from '../config';

class FilmController {
  constructor(container, data, onChangeView, onDataChange) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._filmView = new FilmCard(data);
    this._filmDetails = new FilmCardDetails(data);
    this._currentFilm = this._filmView.getElement();
    this._currentFilmDetails = this._filmDetails.getElement();

    this._onClosePopupClick = this._onClosePopupClick.bind(this);
    this._onOpenPopupClick = this._onOpenPopupClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onControlButtonClick = this._onControlButtonClick.bind(this);

    this.init();
  }

  init() {
    this._renderFilm();
  }

  _renderFilm() {
    this._currentFilm.querySelector(`.film-card__poster`).addEventListener(`click`, this._onOpenPopupClick);
    this._currentFilm.querySelector(`.film-card__title`).addEventListener(`click`, this._onOpenPopupClick);
    this._currentFilm.querySelector(`.film-card__comments`).addEventListener(`click`, this._onOpenPopupClick);
    this._currentFilm.querySelectorAll(`.film-card__controls-item`).forEach((button) => {
      button.addEventListener(`click`, this._onControlButtonClick);
    });

    render(this._container, this._currentFilm, Position.BEFOREEND);
  }

  _renderFilmDetails() {
    const textareaElement = this._currentFilmDetails.querySelector(`.film-details__comment-input`);

    textareaElement.addEventListener(`focus`, () => document.removeEventListener(`keydown`, this._onEscKeyDown));
    textareaElement.addEventListener(`blur`, () => document.addEventListener(`keydown`, this._onEscKeyDown));
    this._currentFilmDetails.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._onClosePopupClick);
    this._currentFilmDetails.querySelectorAll(`.film-details__controls`).forEach((input) =>
      input.addEventListener(`change`, this._onControlButtonClick));

    this._onChangeView();
    render(document.body, this._currentFilmDetails, Position.BEFOREEND);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onClosePopupClick() {
    unrender(this._currentFilmDetails);
  }

  _onOpenPopupClick() {
    this._renderFilmDetails();
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._onClosePopupClick();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _onControlButtonClick(evt) {
    evt.preventDefault();
    const userRate = !this._data._isWatched ? null : this._data._userRating;

    const getNewData = () => {
      switch (evt.target.name) {
        case `watchlist`:
          return Object.assign({}, this._data, {inWatchlist: !this._data.inWatchlist});
        case `watched`:
          return Object.assign({}, this._data, {isWatched: !this._data.isWatched, userRating: userRate});
        case `favorite`:
          return Object.assign({}, this._data, {isFavorite: !this._data.isFavorite});
      }
      return null;
    };

    this.setDefaultView();

    this._onDataChange(getNewData(), this._data);
    this._renderFilmDetails();
  }

  setDefaultView() {
    if (document.body.contains(this._currentFilmDetails)) {
      unrender(this._currentFilmDetails);
      this._filmDetails.removeElement();
    }
  }

}

export default FilmController;
