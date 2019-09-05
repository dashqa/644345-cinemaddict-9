import Search from '../components/search/search';
import Profile from '../components/profile';
import Filter from '../components/filter';
import NavMenu from '../components/nav-menu';
import Statistic from '../components/statistic';
import BoardController from '../controllers/board';
import SearchController from '../controllers/search';
import {render} from '../utils';
import {Position} from '../config';


class PageController {
  constructor(headerContainer, mainContainer, films, filters, statistic, userRating) {
    this._header = headerContainer;
    this._main = mainContainer;
    this._films = films;
    this._filters = filters;
    this._search = new Search();
    this._profile = new Profile(userRating);
    this._nav = new NavMenu();
    this._statistic = new Statistic(statistic);
    this._boardController = null;
    this._searchController = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSearchInput = this._onSearchInput.bind(this);
    this._onNavLinkClick = this._onNavLinkClick.bind(this);
    this._onClearSearchInput = this._onClearSearchInput.bind(this);
  }

  init() {
    this._renderHeader();
    this._renderMain();
    document.body.querySelector(`.footer__statistics`).firstElementChild
      .innerHTML = (`${this._films.length} movies inside `);
  }

  _onDataChange(films) {
    this._films = films;
  }

  _renderHeader() {
    render(this._header, this._search.getElement(), Position.BEFOREEND);
    render(this._header, this._profile.getElement(), Position.BEFOREEND);
  }

  _renderMain() {
    render(this._main, this._nav.getElement(), Position.BEFOREEND);

    if (!this._films.length) {
      return this._main.insertAdjacentHTML(`beforeend`,
          `<div class="no-result">There are no movies in our database.</div>`);
    }

    this._filters.forEach((filter) => render(this._nav.getElement(), new Filter(filter).getElement(), Position.BEFOREEND));

    this._searchController = new SearchController(this._main, this._search, this._onClearSearchInput, this._onDataChange);
    this._boardController = new BoardController(this._main);
    this._boardController.show(this._films);
    render(this._main, this._statistic.getElement(), Position.BEFOREEND);

    this._search.getElement().querySelector(`.search__field`).addEventListener(`input`, this._onSearchInput);
    this._nav.getElement().querySelectorAll(`.main-navigation__item`)
      .forEach((link) => link.addEventListener(`click`, this._onNavLinkClick));

    return null;
  }

  _onNavLinkClick(evt) {
    document.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);

    return evt.target.classList.contains(`main-navigation__item--additional`) ? this._showStatistics() : this._closeStatistics();
  }

  _showStatistics() {
    this._boardController.hide();
    this._statistic.getElement().classList.remove(`visually-hidden`);
  }

  _closeStatistics() {
    this._statistic.getElement().classList.add(`visually-hidden`);
    this._boardController.show(this._films);
  }

  _onClearSearchInput() {
    this._nav.getElement().classList.remove(`visually-hidden`);
    this._statistic.getElement().classList.add(`visually-hidden`);
    this._searchController.hide();
    this._boardController.show(this._films);
  }

  _onSearchInput() {
    this._nav.getElement().classList.add(`visually-hidden`);
    this._statistic.getElement().classList.add(`visually-hidden`);
    this._boardController.hide();
    this._searchController.show(this._films);
  }
}

export default PageController;
