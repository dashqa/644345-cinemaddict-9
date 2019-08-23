import {generateFilmData} from './data/mock';
import {getRandomArray, getSortingValue, render, createElement} from './utils';
import {PageElements, Position, FILM_SECTIONS, STUB_ELEMENT, FILMS_QUANTITY, CARDS_PER_PAGE} from './config';
import Card from './components/film-card';
import CardDetails from './components/film-details';
import Profile from './components/profile';
import Search from './components/search';
import Sorting from './components/sorting';
import Filter from './components/filter';
import FilmSection from './components/film-section';

const filmsData = [...Array(FILMS_QUANTITY)].map(generateFilmData);
let filmsForRender = [];

const state = {
  films: JSON.parse(JSON.stringify(filmsData)),
  quantityCounter: 0,
  userRating: 0,
  watchlist: [],
  watched: [],
  favorites: [],
  get filters() {
    return [{
      title: `All movies`,
      count: this.films.length,
      link: `all`,
      isCountable: true,
      isActive: true,
      isAdditional: false,
    }, {
      title: `Watchlist`,
      count: this.watchlist.length,
      link: `watchlist`,
      isCountable: true,
      isActive: false,
      isAdditional: false,
    }, {
      title: `History`,
      count: this.watched.length,
      link: `history`,
      isCountable: true,
      isActive: false,
      isAdditional: false,
    }, {
      title: `Favorites`,
      count: this.favorites.length,
      link: `favorites`,
      isCountable: true,
      isActive: false,
      isAdditional: false,
    }, {
      title: `Stats`,
      count: null,
      link: `stats`,
      isCountable: false,
      isActive: false,
      isAdditional: true,
    }]
  },
  get statistic() {
    return [{
      rank: `-`,
      watchedQuantity: this.watched.length || 0,
      watchedDuration: 0,
      topGenre: `-`,
    }]
  },
  updateQuantityCounter(quantity) {
    this.quantityCounter += quantity;
  },
};

const search = new Search;
const profile = new Profile(state.userRating);
const sorting = new Sorting;

const findMost = (array, findBy) => {
  const sorted = array.sort((a, b) => getSortingValue(b, findBy) - getSortingValue(a, findBy));
  const first = getSortingValue(sorted[0], findBy);
  const last = getSortingValue(sorted[sorted.length - 1],findBy);

  if (first && last !== 0) {
    return first === last ? getRandomArray(sorted, 2) : sorted.slice(0, 2);
  }
  return null;
};

const renderFilters = (filters) => {
  const nav = document.createElement(`nav`);
  nav.classList.add(`main-navigation`);
  PageElements.MAIN.append(nav);
  const navElement = document.querySelector(`.main-navigation`);
  filters.map((filter) => render(navElement, new Filter(filter).getElement(), Position.BEFOREEND));
};

const renderFilmSections = (sections) => {
  const board = document.createElement(`section`);
  board.classList.add(`films`);
  PageElements.MAIN.append(board);
  const boardElement = document.querySelector(`.films`);
  state.films.length > 0 ? 
    sections.map((section) => render(boardElement, new FilmSection(section).getElement(), Position.BEFOREEND)) :
    render(boardElement, createElement(STUB_ELEMENT), Position.BEFOREEND);
};

const renderMainSection = (start = 0, end = CARDS_PER_PAGE) => {
  const container = document.querySelectorAll(`.films-list__container`)[0];
  filmsForRender = state.films.slice(start, end);
  state.updateQuantityCounter(filmsForRender.length);
  filmsForRender.map((film) => renderFilm(film, container));

  if (state.quantityCounter >= FILMS_QUANTITY || FILMS_QUANTITY < CARDS_PER_PAGE) {
    buttonElement.remove();
  }
};

const renderExtraSection = (type) => {
  const container = document.querySelectorAll(`.films-list__container`)[type === `rating` ? 1 : 2];
  findMost(state.films, type).map((film) => renderFilm(film, container))
};

const renderFilm = (filmData, container) => {
  const film = new Card(filmData);
  const filmDetails = new CardDetails(filmData);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      onClosePopupClick();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };
  const onClosePopupClick = () => filmDetails.removeElement();
  const onOpenPopupClick = () => {
    render(document.body, filmDetails.getElement(), Position.BEFOREEND);

    filmDetails.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, onClosePopupClick);
    filmDetails.getElement().querySelector(`textarea`).addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });
    filmDetails.getElement().querySelector(`textarea`).addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    document.addEventListener(`keydown`, onEscKeyDown);
  };


  film.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, onOpenPopupClick);
  film.getElement().querySelector(`.film-card__title`).addEventListener(`click`, onOpenPopupClick);
  film.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, onOpenPopupClick);

  render(container, film.getElement(), Position.BEFOREEND);
};

const renderFilms = () => {
  renderMainSection();
  renderExtraSection(`rating`);
  renderExtraSection(`comments`);
};

render(PageElements.HEADER, search.getElement(), Position.BEFOREEND);
render(PageElements.HEADER, profile.getElement(), Position.BEFOREEND);
renderFilters(state.filters);
render(PageElements.MAIN, sorting.getElement(), Position.BEFOREEND);
renderFilmSections(FILM_SECTIONS);
renderFilms();

const onClickMoreButton = () => {
  const start = state.quantityCounter;
  const end = state.quantityCounter + CARDS_PER_PAGE;
  renderMainSection(start, end);
};

const buttonElement = document.querySelector(`.films-list__show-more`);
buttonElement.addEventListener(`click`, onClickMoreButton);



export default state;
