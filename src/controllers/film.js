import FilmCard from './../components/film-card';
import FilmCardDetails from './../components/film-details'
import {render} from "../utils";
import {Position} from "../config";

class FilmController {
  constructor(container, data, onChangeView, onDataChange) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._filmView = new FilmCard(data);
    this._filmDetails = new FilmCardDetails(data);

    this.create();
  }

  create() {
    const currentFilm = this._filmView.getElement();

    const renderFilmDetails = () => {
      const currentFilmDetails = this._filmDetails.getElement();
      const textareaElement = currentFilmDetails.querySelector(`.film-details__comment-input`);

      // this._onChangeView();
      render(document.body, currentFilmDetails, Position.BEFOREEND);

      currentFilmDetails.querySelector(`.film-details__close-btn`).addEventListener(`click`, onClosePopupClick);
      // currentFilmDetails.querySelectorAll(`.film-details__control-label`).forEach((button) => {
      //   button.addEventListener(`click`, onControlButtonClick)
      // });
      textareaElement.addEventListener(`focus`, () => document.removeEventListener(`keydown`, onEscKeyDown));
      textareaElement.addEventListener(`blur`, () => document.addEventListener(`keydown`, onEscKeyDown));

      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const onControlButtonClick = (evt) => {
        evt.preventDefault();
        evt.target.classList.toggle(`film-card__controls-item--active`);

        const getEntry = () => {
          switch (evt.target.dataset.action) {
            case `watchlist`:
              return Object.assign({}, this._data, { inWatchlist: !this._data.inWatchlist });
            case `watched`:
              return Object.assign({}, this._data, { isWatched: !this._data.isWatched });
            case `favorite`:
              return Object.assign({}, this._data, { isFavorite: !this._data.isFavorite });
          }
        };

      this._onDataChange(getEntry(), this._data);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        onClosePopupClick();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };
    const onClosePopupClick = () => this.setDefaultView();
    const onOpenPopupClick = () => renderFilmDetails();

    currentFilm.querySelector(`.film-card__poster`).addEventListener(`click`, onOpenPopupClick);
    currentFilm.querySelector(`.film-card__title`).addEventListener(`click`, onOpenPopupClick);
    currentFilm.querySelector(`.film-card__comments`).addEventListener(`click`, onOpenPopupClick);
    currentFilm.querySelectorAll(`.film-card__controls-item`).forEach((button) => {
      button.addEventListener(`click`, onControlButtonClick)
    });

    render(this._container, currentFilm, Position.BEFOREEND);
  }

  setDefaultView() {
    if (document.body.contains(this._filmDetails.getElement())) {
      this._filmDetails.removeElement();
    }
  }

}

export default FilmController;
