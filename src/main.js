import {getSearchComponent} from './components/search';
import {getNavComponent} from './components/nav';
import {getProfileComponent} from './components/profile';
import {getSortingComponent} from './components/sorting';
import {getFilmSectionComponent} from './components/film-section';
import {getCardComponent} from './components/film-card';
import {getMock} from './data/mock';
import {getRandomArray} from './utils';
import {FILM_SECTIONS, FILMS_QUANTITY, CARDS_PER_PAGE} from './config';

const filmsData = getMock(FILMS_QUANTITY);
const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
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
  let sorted = [];
  switch (findBy) {
    case `rating`:
      sorted = array.sort((a, b) => a.rating < b.rating ? 1 : -1);
      return sorted.every(film => film.rating === array[0].rating) ?
        getRandomArray(sorted, 2) : sorted.slice(0, 2);

    case `comments`:
      sorted = array.sort((a, b) => a.comments.length < b.comments.length ? 1 : -1);
      return sorted.every(film => film.comments.length === array[0].comments.length) ?
        getRandomArray(sorted, 2) : sorted.slice(0, 2);
  }
};

const renderFirstSection = (start = 0, end = CARDS_PER_PAGE) => {
  const buttonElement = document.querySelector(`.films-list__show-more`);
  const container = document.querySelectorAll(`.films-list__container`)[0];

  forRender.main = state.films.slice(start, end);
  state.updateQuantityCounter(forRender.main.length);
  renderComponent(container, getCardComponent(forRender.main));

  if (state.quantityCounter >= FILMS_QUANTITY || FILMS_QUANTITY < CARDS_PER_PAGE) {
    buttonElement.remove();
  }
};

  const renderRestSection = (type) => {
    let container = ``;
    switch (type) {
      case `rated`:
        container = document.querySelectorAll(`.films-list__container`)[1];
        forRender.rated = findMost(state.films, `rating`);
        renderComponent(container, getCardComponent(forRender.rated));
        break;
      case `commented`:
        container = document.querySelectorAll(`.films-list__container`)[2];
        forRender.commented = findMost(state.films, `comments`);
        renderComponent(container, getCardComponent(forRender.commented));
    }
};

const renderFilms = () => {
  renderFirstSection();
  renderRestSection(`rated`);
  renderRestSection(`commented`);
};

renderComponent(headerContainer, getSearchComponent());
renderComponent(headerContainer, getProfileComponent(state.userRating));
renderComponent(mainContainer, getNavComponent(state.filters));
renderComponent(mainContainer, getSortingComponent());
renderComponent(mainContainer, getFilmSectionComponent(FILM_SECTIONS));
renderFilms();

const onClickMoreButton = () => {
  const start = state.quantityCounter;
  const end = state.quantityCounter + state.leftToShow;
  renderFirstSection(start, end);
};

const buttonElement = document.querySelector(`.films-list__show-more`);
buttonElement.addEventListener(`click`, onClickMoreButton);
export default state;
