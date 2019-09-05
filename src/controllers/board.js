import Board from '../components/board';
import Sorting from '../components/sorting';
import ShowMore from '../components/show-more';
import FilmSection from '../components/film-section';
import FilmListController from '../controllers/film-list';
import {CARDS_PER_PAGE, FILM_SECTIONS, Position} from '../config';
import {render, unrender, findMostFilm} from '../utils';


class BoardController {
  constructor(container) {
    this._container = container;
    this._films = [];
    this._sorting = new Sorting();
    this._board = new Board();
    this._showMore = new ShowMore();
    this._showedFilms = CARDS_PER_PAGE;

    this._onClickMoreButton = this._onClickMoreButton.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._init();

    this._filmsMainController = new FilmListController(document.querySelectorAll(`.films-list__container`)[0], this._onDataChange);
    this._filmsTopRatedController = new FilmListController(document.querySelectorAll(`.films-list__container`)[1], this._onDataChange);
    this._filmsMostCommentedController = new FilmListController(document.querySelectorAll(`.films-list__container`)[2], this._onDataChange);
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

  _init() {
    render(this._container, this._sorting.getElement(), Position.BEFOREEND);
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    FILM_SECTIONS.forEach((section) => render(this._board.getElement(), new FilmSection(section).getElement(), Position.BEFOREEND));
    this._sorting.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _setFilms(films) {
    this._films = films;
    this._showedFilms = CARDS_PER_PAGE;

    this._renderBoard();
  }

  _onDataChange(films) {
    this._films = [...films, ...this._films.slice(this._showedFilms, this._films.length)];
    this._renderBoard();
  }

  _renderBoard() {
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

    if (this._showedFilms >= this._films.length) {
      unrender(this._showMore.getElement());
      this._showMore.removeElement();
    }
  }

  _renderShowMore() {
    const filmsList = document.querySelector(`.films-list`);
    const showMoreElement = this._showMore.getElement();

    render(filmsList, showMoreElement, Position.BEFOREEND);
    showMoreElement.addEventListener(`click`, this._onClickMoreButton);
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();
    if (evt.target.className !== `sort__button`) {
      return;
    }
    document.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);

    const getSortedFilmsArray = () => {
      switch (evt.target.dataset.sortType) {
        case `date`:
          return this._films.slice().sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        case `rating`:
          return this._films.slice().sort((a, b) => b.rating - a.rating);
        case `default`:
          return this._films;
      }
      return null;
    };

    this._films = getSortedFilmsArray();
    this._filmsMainController.setFilms(this._films.slice(0, this._showedFilms));
  }
}

export default BoardController;
