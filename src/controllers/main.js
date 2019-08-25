import Sorting from '../components/sorting';
import Board from '../components/board';
import Filter from '../components/filter';
import NavMenu from '../components/nav-menu';
import FilmSection from '../components/film-section';
import FilmCard from '../components/film-card';
import FilmCardDetails from '../components/film-details';
import ShowMore from '../components/show-more';
import {render, findMostFilm} from '../utils';
import {CARDS_PER_PAGE, Position} from '../config';


class MainController {
  constructor(container, films, filters, sections) {
    this._container = container;
    this._films = films;
    this._filters = filters;
    this._sections = sections;
    this._nav = new NavMenu();
    this._sorting = new Sorting;
    this._board = new Board(this._films.length);
    this._showMore = new ShowMore();
  }

  init() {
    render(this._container, this._nav.getElement(), Position.BEFOREEND);
    this._renderFilters();
    render(this._container, this._sorting.getElement(), Position.BEFOREEND);
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    this._renderFilmSections();
    this._renderMainSection(this._films);
    this._renderExtraSection(`rating`);
    this._renderExtraSection(`comments`);
    this._films.length > CARDS_PER_PAGE ? this._renderShowMore(CARDS_PER_PAGE) : ``;
  }

  _renderFilters() {
    this._filters.forEach((filter) => render(this._nav.getElement(), new Filter(filter).getElement(), Position.BEFOREEND));
  }

  _renderFilmSections() {
    this._sections.forEach((section) => render(this._board.getElement(), new FilmSection(section).getElement(), Position.BEFOREEND));
  }

  _renderFilm(film, container) {
    const filmComponent = new FilmCard(film);
    const filmDetailsComponent = new FilmCardDetails(film);
    const currentFilm = filmComponent.getElement();


    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        onClosePopupClick();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };
    const onClosePopupClick = () => filmDetailsComponent.removeElement();
    const onOpenPopupClick = () => {
      const currentFilmDetails = filmDetailsComponent.getElement();
      render(document.body, currentFilmDetails, Position.BEFOREEND);

      const textareaElement = currentFilmDetails.querySelector(`.film-details__comment-input`);
      currentFilmDetails.querySelector(`.film-details__close-btn`).addEventListener(`click`, onClosePopupClick);
      textareaElement.addEventListener(`focus`, () => document.removeEventListener(`keydown`, onEscKeyDown));
      textareaElement.addEventListener(`blur`, () => document.addEventListener(`keydown`, onEscKeyDown));

      document.addEventListener(`keydown`, onEscKeyDown);
    };


    currentFilm.querySelector(`.film-card__poster`).addEventListener(`click`, onOpenPopupClick);
    currentFilm.querySelector(`.film-card__title`).addEventListener(`click`, onOpenPopupClick);
    currentFilm.querySelector(`.film-card__comments`).addEventListener(`click`, onOpenPopupClick);

    render(container, currentFilm, Position.BEFOREEND);
  }

  _renderMainSection(filmsArray, start = 0, end = CARDS_PER_PAGE) {
    const container = document.querySelectorAll(`.films-list__container`)[0];
    filmsArray.slice(start, end).map((film) => this._renderFilm(film, container));
  }

  _renderExtraSection(type) {
    const container = document.querySelectorAll(`.films-list__container`)[type === `rating` ? 1 : 2];
    findMostFilm(this._films, type).forEach((film) => this._renderFilm(film, container))
  }

  _renderShowMore() {
    const filmList = document.querySelector(`.films-list`);
    let quantityCounter = CARDS_PER_PAGE;
    render(filmList, this._showMore.getElement(), Position.BEFOREEND);

    const onClickMoreButton = () => {
      const start = quantityCounter;
      const end = quantityCounter + CARDS_PER_PAGE;
      quantityCounter = end;

      quantityCounter >= this._films.length ? this._showMore.removeElement() : ``;
      this._renderMainSection(this._films, start, end);
    };
    this._showMore.getElement().addEventListener(`click`, onClickMoreButton);
  }

}

export default MainController;
