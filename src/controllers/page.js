import Store from '../store';
import Provider from '../components/api/provider';
import Search from '../components/search/search';
import NavController from '../controllers/nav';
import StatisticController from '../controllers/statistic';
import BoardController from '../controllers/board';
import SearchController from '../controllers/search';
import ProfileController from '../controllers/profile';
import {API} from '../components/api/api';
import {render} from '../utils';
import {Position, Api, PageElement, FILMS_STORE_KEY} from '../config';

class PageController {
  constructor(headerContainer, mainContainer) {
    this._header = headerContainer;
    this._main = mainContainer;

    this._search = new Search();
    this._store = new Store({storage: window.localStorage, key: FILMS_STORE_KEY});
    this._provider = new Provider({
      api: new API({endPoint: Api.END_POINT, authorization: Api.AUTHORIZATION}),
      store: this._store,
    });

    this._films = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onCommentsChange = this._onCommentsChange.bind(this);
    this._onInputClick = this._onInputClick.bind(this);
    this._showStatistic = this._showStatistic.bind(this);
    this._showFilteredFilms = this._showFilteredFilms.bind(this);
    this._onClearSearchInput = this._onClearSearchInput.bind(this);

    this._profileController = new ProfileController(this._header);
    this._navController = new NavController(this._main, this._showStatistic, this._showFilteredFilms);
    this._boardController = new BoardController(this._main, this._onDataChange, this._onCommentsChange);
    this._statisticController = new StatisticController(this._main);
    this._searchController = new SearchController(
        this._main, this._search, this._onClearSearchInput, this._onDataChange, this._onCommentsChange);
  }

  init() {
    this._provider.getFilms()
      .then((films) => {
        this._films = films;

        this._renderHeader();
        this._renderMain();
        PageElement.FOOTER_STATISTICS.firstElementChild
          .innerText = `${this._films.length} movies inside`;
      });

    window.addEventListener(`offline`, this._onOfflineState);
    window.addEventListener(`online`, this._onOnlineState);
  }

  _renderHeader() {
    render(this._header, this._search.getElement(), Position.BEFOREEND);
    this._profileController.show(this._films);
  }

  _renderMain() {
    this._navController.show(this._films);

    if (!this._films.length) {
      return this._main.insertAdjacentHTML(`beforeend`,
          `<div class="no-result">There are no movies in our database.</div>`);
    }
    this._boardController.show(this._films);
    this._search.getElement().querySelector(`.search__field`).addEventListener(`click`, this._onInputClick);

    return null;
  }

  _showSearch() {
    this._navController.hide();
    this._statisticController.hide();
    this._boardController.hide();
    this._searchController.show(this._films);
  }

  _showStatistic() {
    this._boardController.hide();
    this._statisticController.show(this._films);
  }

  _showFilteredFilms(filteredFilms) {
    this._statisticController.hide();
    this._boardController.show(filteredFilms);
  }

  _onOfflineState() {
    document.title = `${document.title}[OFFLINE]`;
  }

  _onOnlineState() {
    document.title = document.title.split(`[OFFLINE]`)[0];
    this._provider.syncFilms();
  }

  _onDataChange(newFilmData, isSearchOpen = false) {
    this._provider.updateFilm({
      id: newFilmData.id,
      data: newFilmData.toRAW(),
    })
      .then(() => this._provider.getFilms())
      .then((films) => {
        this._films = films;

        this._profileController.show(this._films);
        this._navController.show(this._films);
        this._boardController.show(this._films);

        if (isSearchOpen) {
          this._showSearch();
        }
      });
  }

  _onCommentsChange({action, comment = null, filmId = null, commentId = null}) {
    switch (action) {
      case `get`:
        return this._provider.getComments({filmId});
      case `create`:
        this._provider.createComment({
          comment,
          filmId,
        })
          .then(() => this._provider.getFilms())
          .then((films) => {
            this._films = films;
            this._boardController.show(this._films);
          });
        break;
      case `delete`:
        this._provider.deleteComment({
          filmId,
          commentId
        })
          .then(() => this._provider.getFilms())
          .then((films) => {
            this._films = films;
            this._boardController.show(this._films);
          });
    }
    return null;
  }

  _onInputClick(evt) {
    if (evt.key === `Enter`) {
      evt.preventDefault();
      return;
    }

    this._showSearch();
  }

  _onClearSearchInput() {
    this._statisticController.hide();
    this._searchController.hide();
    this._navController.show(this._films);
    this._boardController.show(this._films);
  }
}

export default PageController;
