import PageController from './controllers/page';
import {PageElement} from './config';


const state = {
  userRating: 10,
  get filters() {
    return [{
      title: `All movies`,
      count: 0,
      link: `all`,
      isCountable: true,
      isActive: true,
      isAdditional: false,
    }, {
      title: `Watchlist`,
      count: 0,
      link: `watchlist`,
      isCountable: true,
      isActive: false,
      isAdditional: false,
    }, {
      title: `History`,
      count: 0,
      link: `history`,
      isCountable: true,
      isActive: false,
      isAdditional: false,
    }, {
      title: `Favorites`,
      count: 0,
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
};

const pageController = new PageController(PageElement.HEADER, PageElement.MAIN, state.filters, state.userRating);
pageController.init();

