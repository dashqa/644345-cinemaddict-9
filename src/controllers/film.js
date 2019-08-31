import FilmCard from './../components/film-card';
import FilmCardDetails from './../components/film-details';
import {render} from '../utils';
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

    this._onChangeView();
    render(document.body, this._currentFilmDetails, Position.BEFOREEND);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onClosePopupClick() {
    const formData = new FormData(this._currentFilmDetails.querySelector(`.film-details__inner`));
    const newData = {
      userRating: formData.get(`score`),
      inWatchlist: formData.get(`watchlist`) === `on`,
      isWatched: formData.get(`watched`) === `on`,
      isFavorite: formData.get(`favorite`) === `on`,
    };

    this._onDataChange(Object.assign({}, this._data, newData), this._data);
    this.setDefaultView();
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
    evt.target.classList.toggle(`film-card__controls-item--active`);

    const userRate = !this._data._isWatched ? null : this._data._userRating;

    const getNewData = () => {
      switch (evt.target.dataset.action) {
        case `watchlist`:
          return Object.assign({}, this._data, {inWatchlist: !this._data.inWatchlist});
        case `watched`:
          return Object.assign({}, this._data, {isWatched: !this._data.isWatched, userRating: userRate});
        case `favorite`:
          return Object.assign({}, this._data, {isFavorite: !this._data.isFavorite});
      }
      return null;
    };

    this._onDataChange(getNewData(), this._data);
  }

  setDefaultView() {
    if (document.body.contains(this._filmDetails.getElement())) {
      this._filmDetails.removeElement();
    }
  }

}

export default FilmController;
