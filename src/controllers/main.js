import Sorting from '../components/sorting';
import Board from '../components/board';
import Filter from '../components/filter';
import NavMenu from '../components/nav-menu';
import FilmSection from '../components/film-section';
import ShowMore from '../components/show-more';
import FilmController from './film';
import {render, unrender, findMostFilm} from '../utils';
import {CARDS_PER_PAGE, Position} from '../config';


class MainController {
  constructor(container, films, filters, sections) {
    this._container = container;
    this._films = films;
    this._filters = filters;
    this._sections = sections;
    this._nav = new NavMenu();
    this._sorting = new Sorting();
    this._board = new Board(this._films.length);
    this._showMore = new ShowMore();

    this._subscriptions = [];
    this._initialFilms = [...this._films];
    this._showedTasks = CARDS_PER_PAGE;
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onClickMoreButton = this._onClickMoreButton.bind(this);
  }

  init() {
    render(this._container, this._nav.getElement(), Position.BEFOREEND);
    this._renderFilters();
    render(this._container, this._sorting.getElement(), Position.BEFOREEND);
    render(this._container, this._board.getElement(), Position.BEFOREEND);

    if (this._films.length) {
      this._renderFilmSections();
      this._renderMainSection();
      this._renderExtraSection(`rating`);
      this._renderExtraSection(`comments`);
      if (this._showedTasks < this._films.length) {
        this._renderShowMore();
      }

      this._sorting.getElement()
        .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
    }
  }

  _renderFilters() {
    this._filters.forEach((filter) => render(this._nav.getElement(), new Filter(filter).getElement(), Position.BEFOREEND));
  }

  _renderFilmSections() {
    this._sections.forEach((section) => render(this._board.getElement(), new FilmSection(section).getElement(), Position.BEFOREEND));
  }

  _renderFilm(film, container = document.querySelectorAll(`.films-list__container`)[0]) {
    const filmController = new FilmController(container, film, this._onChangeView, this._onDataChange);
    this._subscriptions.push(filmController.setDefaultView.bind(filmController));
  }

  _reRenderMainSection(filmsArray) {
    const container = document.querySelectorAll(`.films-list__container`)[0];
    container.innerHTML = ``;
    unrender(this._showMore.getElement());
    this._showMore.removeElement();
    this._renderMainSection(filmsArray);
    this._renderShowMore(filmsArray);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onDataChange(newData, oldData) {
    this._films[this._films.indexOf(oldData)] = newData;
    this._reRenderMainSection(this._films);
  }

  _renderMainSection() {
    this._films.slice(0, CARDS_PER_PAGE).forEach((film) => this._renderFilm(film));
  }

  _renderExtraSection(type) {
    const container = document.querySelectorAll(`.films-list__container`)[type === `rating` ? 1 : 2];
    findMostFilm([...this._films], type).forEach((film) => this._renderFilm(film, container));
  }

  _onClickMoreButton() {
    this._films.slice(this._showedTasks, this._showedTasks + CARDS_PER_PAGE).forEach((film) => this._renderFilm(film));
    this._showedTasks += CARDS_PER_PAGE;

    if (this._showedTasks >= this._films.length) {
      unrender(this._showMore.getElement());
      this._showMore.removeElement();
    }
  }

  _renderShowMore() {
    const filmList = document.querySelector(`.films-list`);
    const showMoreElement = this._showMore.getElement();

    render(filmList, showMoreElement, Position.BEFOREEND);
    showMoreElement.addEventListener(`click`, this._onClickMoreButton);
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();
    if (evt.target.className !== `sort__button`) {
      return;
    }

    const container = document.querySelectorAll(`.films-list__container`)[0];
    container.innerHTML = ``;

    const getSortedFilmsArray = () => {
      switch (evt.target.dataset.sortType) {
        case `date`:
          return this._films.slice().sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        case `rating`:
          return this._films.slice().sort((a, b) => b.rating - a.rating);
        case `default`:
          return this._initialFilms;
      }
      return null;
    };

    document.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);

    this._films = getSortedFilmsArray();
    this._films.slice(0, this._showedTasks).forEach((film) => this._renderFilm(film));
  }
}

export default MainController;
