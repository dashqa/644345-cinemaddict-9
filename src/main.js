import MainController from './controllers/main';
import HeaderController from './controllers/header';
import {generateFilmData} from './data/mock';
import {PageElement, FILMS_QUANTITY, FILM_SECTIONS} from './config';


const filmsData = [...Array(FILMS_QUANTITY)].map(generateFilmData);

const state = {
  films: JSON.parse(JSON.stringify(filmsData)),
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
};
const headerController = new HeaderController(PageElement.HEADER, state.userRating);
const mainController = new MainController(PageElement.MAIN, state.films, state.filters, FILM_SECTIONS);

headerController.init();
mainController.init();

export default state;
