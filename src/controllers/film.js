import FilmCard from './../components/film-card';
import FilmCardDetails from './../components/film-details';
import {render, unrender, getDeepClassCopy} from '../utils';
import {Position} from '../config';

class FilmController {
  constructor(container, data, onChangeView, onDataChange, onCommentsChange) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._onCommentsChange = onCommentsChange;
    this._filmView = new FilmCard(data);
    this._currentFilm = this._filmView.getElement();
    this._filmDetails = {};

    this._onClosePopupClick = this._onClosePopupClick.bind(this);
    this._onOpenPopupClick = this._onOpenPopupClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onControlButtonClick = this._onControlButtonClick.bind(this);
    this._onChangeUserRating = this._onChangeUserRating.bind(this);
    this._onCommentDelete = this._onCommentDelete.bind(this);
    this._onAddCommentEnterKey = this._onAddCommentEnterKey.bind(this);

    this.init();
  }

  init() {
    this._renderFilm();
  }

  setDefaultView() {
    if (document.body.contains(this._currentFilmDetails)) {
      unrender(this._currentFilmDetails);
      this._filmDetails.removeElement();
    }
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

  _initializeFilmDetails() {
    this._onCommentsChange({action: `get`, filmId: this._data.id})
      .then((comments) => {
        this._filmDetails = new FilmCardDetails(this._data, comments);
      })
      .then(() => this._renderFilmDetails());
  }

  _renderFilmDetails() {
    this._currentFilmDetails = this._filmDetails.getElement();

    const textareaElement = this._currentFilmDetails.querySelector(`.film-details__comment-input`);
    textareaElement.addEventListener(`focus`, () => document.removeEventListener(`keydown`, this._onEscKeyDown));
    textareaElement.addEventListener(`blur`, () => document.addEventListener(`keydown`, this._onEscKeyDown));
    this._currentFilmDetails.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._onClosePopupClick);
    this._currentFilmDetails.querySelectorAll(`.film-details__controls`).forEach((input) =>
      input.addEventListener(`change`, this._onControlButtonClick));
    this._currentFilmDetails.querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._onAddCommentEnterKey);
    this._currentFilmDetails.querySelectorAll(`.film-details__comment-delete`).forEach((button) => {
      button.addEventListener(`click`, this._onCommentDelete);
    });

    if (this._data.isWatched) {
      this._currentFilmDetails.querySelectorAll(`.film-details__user-rating-input`).forEach((input) =>
        input.addEventListener(`change`, this._onChangeUserRating));
      this._currentFilmDetails.querySelector(`.film-details__watched-reset`).addEventListener(`click`, this._onChangeUserRating);
    }

    this._onChangeView();
    render(document.body, this._currentFilmDetails, Position.BEFOREEND);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _setDetailsView() {
    if (document.body.contains(this._currentFilmDetails)) {
      unrender(this._currentFilmDetails);
      this._filmDetails.removeElement();

      this._initializeFilmDetails();
    }
  }

  _onOpenPopupClick() {
    this._initializeFilmDetails();
  }

  _onClosePopupClick() {
    this.setDefaultView();
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._onClosePopupClick();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _onChangeUserRating(evt) {
    this._onDataChange(Object.assign(
        getDeepClassCopy(this._data), {userRating: evt.target.value || 0}));

    this._setDetailsView();
  }

  _onCommentDelete(evt) {
    this._onCommentsChange({action: `delete`, filmId: this._data.id, commentId: evt.target.dataset.id});
    this._setDetailsView();
  }

  _onAddCommentEnterKey(evt) {
    if (!(evt.key === `Enter` && (evt.ctrlKey || evt.metaKey))) {
      return;
    }
    evt.preventDefault();
    evt.stopPropagation();

    const checkedEmoji = [...this._filmDetails.getElement().querySelectorAll(`input[name=comment-emoji]`)]
      .filter((input) => input.checked)[0].value;

    this._onCommentsChange({
      action: `create`,
      comment: {
        comment: evt.target.value,
        date: new Date(),
        emotion: String(checkedEmoji)
      },
      filmId: this._data.id
    });

    this._setDetailsView();
  }

  _onControlButtonClick(evt) {
    evt.preventDefault();
    const userRating = !this._data.isWatched ? 0 : this._data._userRating || 0;
    const watchedDate = this._data.isWatched ? null : new Date();

    const getNewPropertiesValue = () => {
      switch (evt.target.name) {
        case `watchlist`:
          return {inWatchlist: !this._data.inWatchlist};
        case `watched`:
          return {isWatched: !this._data.isWatched, userRating, watchedDate};
        case `favorite`:
          return {isFavorite: !this._data.isFavorite};
      }
      return null;
    };

    this._onDataChange(Object.assign(
        getDeepClassCopy(this._data), getNewPropertiesValue()));

    this._setDetailsView();
  }
}

export default FilmController;
