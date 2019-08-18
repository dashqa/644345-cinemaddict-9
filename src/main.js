import {getSearchMarkup} from './components/search';
import {getNavMarkup} from './components/nav';
import {getProfileMarkup} from './components/profile';
import {getSortingMarkup} from './components/sorting';
import {getFilmSectionMarkup} from './components/film-section';
import {getCards} from './components/film-card';
import {getMock} from './data/mock';
import {getRandomArray, getSortingValue} from './utils';
import {FILM_SECTIONS, FILMS_QUANTITY, CARDS_PER_PAGE, STUB} from './config';

const filmsData = getMock(FILMS_QUANTITY);
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
let forRender = {
  main: [],
  rated: [],
  commented: [],
};

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
      isMain: true,
    }, {
      title: `Watchlist`,
      count: this.watchlist.length,
    }, {
      title: `History`,
      count: this.watched.length,
    }, {
      title: `Favorites`,
      count: this.favorites.length,
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

const renderComponent = (container, component) => {
  container.insertAdjacentHTML(`beforeend`, component);
};

const findMost = (array, findBy) => {
  const sorted = array.sort((a, b) => getSortingValue(b, findBy) - getSortingValue(a, findBy));
  const first = getSortingValue(sorted[0], findBy);
  const last = getSortingValue(sorted[sorted.length - 1],findBy);

  if (first && last !== 0) {
    return first === last ? getRandomArray(sorted, 2) : sorted.slice(0, 2);
  }
  return null;
};

const renderMainSection = (start = 0, end = CARDS_PER_PAGE) => {
  const buttonElement = document.querySelector(`.films-list__show-more`);
  const container = main.querySelectorAll(`.films-list__container`)[0];

  forRender.main = state.films.slice(start, end);
  state.updateQuantityCounter(forRender.main.length);
  renderComponent(container, getCards(forRender.main));

  if (state.quantityCounter >= FILMS_QUANTITY || FILMS_QUANTITY < CARDS_PER_PAGE) {
    buttonElement.remove();
  }
};

const renderExtraSection = (arrayForRender, type) => {
  const container = main.querySelectorAll(`.films-list__container`)[type === `rating` ? 1 : 2];
  arrayForRender = findMost(state.films, type);
  renderComponent(container, getCards(arrayForRender));
};

const renderFilms = () => {
  renderMainSection();
  renderExtraSection(forRender.rated, `rating`);
  renderExtraSection(forRender.commented, `comments`);
};

renderComponent(header, getSearchMarkup());
renderComponent(header, getProfileMarkup(state.userRating));
renderComponent(main, getNavMarkup(state.filters));
renderComponent(main, getSortingMarkup());
renderComponent(main, getFilmSectionMarkup(FILM_SECTIONS));
renderFilms();

const onClickMoreButton = () => {
  const start = state.quantityCounter;
  const end = state.quantityCounter + state.leftToShow;
  renderMainSection(start, end);
};

const buttonElement = document.querySelector(`.films-list__show-more`);
buttonElement.addEventListener(`click`, onClickMoreButton);
export default state;
