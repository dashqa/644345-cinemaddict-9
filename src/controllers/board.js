import Board from '../components/board';
import Sorting from '../components/sorting';
import ShowMore from '../components/show-more';
import FilmSection from '../components/film-section';
import FilmListController from '../controllers/film-list';
import {CARDS_PER_PAGE, FILM_SECTIONS, Position} from '../config';
import {render, unrender, findMostFilm, getSortedFilmsArray} from '../utils';

class BoardController {
  constructor(container, onDataChange, onCommentsChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._onCommentsChangeMain = onCommentsChange;

    this._films = [];
    this._sorting = new Sorting();
    this._board = new Board();
    this._showMore = new ShowMore();
    this._showedFilms = null;
    this._currentSorting = `default`;

    this._onDataChange = this._onDataChange.bind(this);
    this._onCommentsChange = this._onCommentsChange.bind(this);
    this._onClickMoreButton = this._onClickMoreButton.bind(this);

    this._init();

    this._filmsMainController = new FilmListController(document.querySelectorAll(`.films-list__container`)[0], this._onDataChange, this._onCommentsChange);
    this._filmsTopRatedController = new FilmListController(document.querySelectorAll(`.films-list__container`)[1], this._onDataChange, this._onCommentsChange);
    this._filmsMostCommentedController = new FilmListController(document.querySelectorAll(`.films-list__container`)[2], this._onDataChange, this._onCommentsChange);
  }

  show(films) {
    if (films !== this._films) {
      this._setFilms(films);
    }

    this._sorting.getElement().classList.remove(`visually-hidden`);
    this._board.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._sorting.getElement().classList.add(`visually-hidden`);
    this._board.getElement().classList.add(`visually-hidden`);
  }

  _onDataChange(newFilmData) {
    this._onDataChangeMain(newFilmData);
  }

  _onCommentsChange(commentActivity) {
    this._onCommentsChangeMain(commentActivity);
  }

  _init() {
    render(this._container, this._sorting.getElement(), Position.BEFOREEND);
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    FILM_SECTIONS.forEach((section) => render(this._board.getElement(), new FilmSection(section).getElement(), Position.BEFOREEND));
    this._sorting.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _setFilms(films) {
    this._films = getSortedFilmsArray(films, this._currentSorting);
    this._showedFilms = this._showedFilms ? this._showedFilms : CARDS_PER_PAGE;

    this._renderBoard();
  }

  _renderBoard() {
    this._unrenderShowMore();

    if (this._showedFilms < this._films.length) {
      this._renderShowMore();
    }

    this._filmsMainController.setFilms(this._films.slice(0, this._showedFilms));
    this._filmsTopRatedController.setFilms(findMostFilm([...this._films], `rating`));
    this._filmsMostCommentedController.setFilms(findMostFilm([...this._films], `comment`));
  }

  _onClickMoreButton() {
    this._filmsMainController.addFilms(this._films.slice(this._showedFilms, this._showedFilms + CARDS_PER_PAGE));
    this._showedFilms += CARDS_PER_PAGE;

    this._unrenderShowMore();
  }

  _renderShowMore() {
    const filmsList = document.querySelector(`.films-list`);
    const showMoreElement = this._showMore.getElement();

    render(filmsList, showMoreElement, Position.BEFOREEND);
    showMoreElement.addEventListener(`click`, this._onClickMoreButton);
  }

  _unrenderShowMore() {
    if (this._showedFilms >= this._films.length) {
      unrender(this._showMore.getElement());
      this._showMore.removeElement();
    }
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();
    if (evt.target.className !== `sort__button`) {
      return;
    }

    document.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);

    this._currentSorting = evt.target.dataset.sortType;
    this._filmsMainController.setFilms(getSortedFilmsArray(this._films, evt.target.dataset.sortType)
      .slice(0, this._showedFilms));
  }
}

export default BoardController;
