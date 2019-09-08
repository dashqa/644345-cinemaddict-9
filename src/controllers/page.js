import Search from '../components/search/search';
import Profile from '../components/profile';
import Filter from '../components/filter';
import NavMenu from '../components/nav-menu';
import Statistic from '../components/statistic';
import StatisticController from '../controllers/statistic';
import BoardController from '../controllers/board';
import SearchController from '../controllers/search';
import {API} from '../components/api/api';
import {render} from '../utils';
import {Position, Api} from '../config';

class PageController {
  constructor(headerContainer, mainContainer, filters, userRating) {
    this._header = headerContainer;
    this._main = mainContainer;
    this._filters = filters;
    this._userRating = userRating;

    this._search = new Search();
    this._profile = new Profile(this._userRating);
    this._nav = new NavMenu();
    this._api = new API({endPoint: Api.END_POINT, authorization: Api.AUTHORIZATION});
    this._statistic = new Statistic({});

    this._films = [];
    this._boardController = null;
    this._searchController = null;
    this._statisticController = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onCommentsChange = this._onCommentsChange.bind(this);
    this._onSearchInput = this._onSearchInput.bind(this);
    this._onNavLinkClick = this._onNavLinkClick.bind(this);
    this._onClearSearchInput = this._onClearSearchInput.bind(this);
  }

  init() {
    this._api.getFilms()
      .then((films) => {
        this._films = films;
      })
      .then(() => this._renderHeader())
      .then(() => this._renderMain())
      .then(() => {
        document.body.querySelector(`.footer__statistics`).firstElementChild
          .innerHTML = (`${this._films.length} movies inside`);
      });
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
    render(this._main, this._statistic.getElement(), Position.BEFOREEND);

    this._statisticController = new StatisticController(this._main, this._statistic, this._userRating);
    this._boardController = new BoardController(this._main, this._onDataChange, this._onCommentsChange);
    this._searchController = new SearchController(this._main, this._search, this._onClearSearchInput, this._onDataChange, this._onCommentsChange);
    this._boardController.show(this._films);

    this._search.getElement().querySelector(`.search__field`).addEventListener(`input`, this._onSearchInput);
    this._nav.getElement().querySelectorAll(`.main-navigation__item`)
      .forEach((link) => link.addEventListener(`click`, this._onNavLinkClick));

    return null;
  }

  _onDataChange(newFilmData, isSearchOpen = false) {
    this._api.updateFilm({
      id: newFilmData.id,
      data: newFilmData.toRAW(),
    })
      .then(() => this._api.getFilms())
      .then((films) => {
        this._boardController.show(films);

        if (isSearchOpen) {
          this._showSearch();
        }
      });
  }

  _onCommentsChange({action, comment = null, filmId = null, commentId = null}) {
    switch (action) {
      case `create`:
        this._api.createComment({
          comment,
          filmId,
        })
          .then(() => this._api.getFilms())
          .then((films) => this._boardController.show(films));
        break;
      case `delete`:
        this._api.deleteComment({
          commentId
        })
          .then(() => this._api.getFilms())
          .then((films) => this._boardController.show(films));
    }
  }

  _onNavLinkClick(evt) {
    document.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);

    return evt.target.classList.contains(`main-navigation__item--additional`) ? this._showStatistics() : this._closeStatistics();
  }

  _showSearch() {
    this._nav.getElement().classList.add(`visually-hidden`);
    this._statisticController.hide();
    this._boardController.hide();
    this._searchController.show(this._films);
  }

  _showStatistics() {
    this._boardController.hide();
    this._statisticController.show(this._films);
  }

  _closeStatistics() {
    this._statisticController.hide();
    this._boardController.show(this._films);
  }

  _onSearchInput() {
    this._showSearch();
  }

  _onClearSearchInput() {
    this._nav.getElement().classList.remove(`visually-hidden`);
    this._statisticController.hide();
    this._searchController.hide();
    this._boardController.show(this._films);
  }
}

export default PageController;
