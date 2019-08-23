import {generateFilmData} from './data/mock';
import {getRandomArray, getSortingValue, render} from './utils';
import {FILM_SECTIONS, PageElements, Position, FILMS_QUANTITY, CARDS_PER_PAGE} from './config';
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
  get leftToShow() {
    return this.films.length - this.quantityCounter;
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
  sections.map((section) => render(boardElement, new FilmSection(section).getElement(), Position.BEFOREEND));
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
  const filmsArray = findMost(state.films, type);
  filmsArray.map((film) => renderFilm(film, container))
};

const renderFilm = (filmData, container) => {
  const film = new Card(filmData);
  const filmDetails = new CardDetails(filmData);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      filmDetails.removeElement();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const onClickClosePopup = () => filmDetails.removeElement();
  const onClickOpenPopup = () => {
    render(document.body, filmDetails.getElement(), Position.BEFOREEND);
    filmDetails.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, onClickClosePopup);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  film.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, onClickOpenPopup);
  film.getElement().querySelector(`.film-card__title`).addEventListener(`click`, onClickOpenPopup);
  film.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, onClickOpenPopup);

  render(container, film.getElement(), Position.BEFOREEND);
};

const renderFilms = () => {
  renderMainSection();
  renderExtraSection(`rating`);
  renderExtraSection(`comments`);
};

render(PageElements.HEADER, search.getElement(), Position.BEFOREEND);
render(PageElements.HEADER, profile.getElement(), Position.BEFOREEND);
render(PageElements.MAIN, renderFilters(state.filters), Position.BEFOREEND);
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
