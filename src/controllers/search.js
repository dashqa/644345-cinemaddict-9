import SearchResultInfo from '../components/search/search-result-info';
import SearchResultGroup from '../components/search/search-result-group';
import FilmsListController from '../controllers/film-list';
import {render, unrender} from '../utils';
import {Position, MIN_SEARCH_LENGTH} from '../config';

class SearchController {
  constructor(container, search, onClearSearchInput, onDataChange1) {
    this._container = container;
    this._search = search;
    this._onClearSearch = onClearSearchInput;
    this._onDataChangeMain = onDataChange1;

    this._films = [];
    this._searchResultInfo = new SearchResultInfo({});
    this._searchResultGroup = new SearchResultGroup();

    this._filmsListController = new FilmsListController(
        this._searchResultGroup.getElement().querySelector(`.films-list__container`), this._onDataChange.bind(this));

    this._onResetButtonClick = this._onResetButtonClick.bind(this);
    this._onInputKeyup = this._onInputKeyup.bind(this);
  }

  hide() {
    this._unrender();
  }

  show(films) {
    this._films = films;
    this._showSearchResult(``, this._films);
    this._render();
  }

  _render() {
    render(this._container, this._searchResultInfo.getElement(), Position.BEFOREEND);
    render(this._container, this._searchResultGroup.getElement(), Position.BEFOREEND);

    this._search.getElement().querySelector(`.search__reset`).addEventListener(`click`, this._onResetButtonClick);
    this._search.getElement().querySelector(`input`).addEventListener(`keyup`, this._onInputKeyup);
  }

  _unrender() {
    unrender(this._searchResultInfo.getElement());
    unrender(this._searchResultGroup.getElement());
  }

  _onResetButtonClick() {
    this._search.getElement().querySelector(`input`).value = ``;
    this._onClearSearch();
  }

  _onInputKeyup(evt) {
    const {value} = evt.target;
    if (!value) {
      return this._onClearSearch();
    }

    if (value.length >= MIN_SEARCH_LENGTH) {
      const films = this._films.filter((film) => film.title.toLowerCase().includes(value.toLowerCase()));
      this._showSearchResult(value, films);
    }

    return null;
  }

  _showSearchResult(text, films) {
    if (this._searchResultInfo) {
      unrender(this._searchResultInfo.getElement());
      this._searchResultInfo.removeElement();
    }

    this._searchResultInfo = new SearchResultInfo({counter: films.length});
    render(this._container, this._searchResultInfo.getElement(), Position.AFTERBEGIN);
    this._filmsListController.setFilms(films);
  }

  _onDataChange(films) {
    this._films = films;
    // this._onDataChangeMain(this._films);
  }

}

export default SearchController;
