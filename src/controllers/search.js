import SearchResultInfo from '../components/search/search-result-info';
import SearchResultGroup from '../components/search/search-result-group';
import FilmsListController from '../controllers/film-list';
import {render, unrender, debounce} from '../utils';
import {Position, MIN_SEARCH_LENGTH} from '../config';

class SearchController {
  constructor(container, search, onClearSearchInput, onDataChange, onCommentsChange) {
    this._container = container;
    this._search = search;
    this._onClearSearch = onClearSearchInput;
    this._onDataChangeMain = onDataChange;
    this._onCommentsChangeMain = onCommentsChange;

    this._films = [];
    this._searchInput = ``;
    this._searchResultInfo = new SearchResultInfo({});
    this._searchResultGroup = new SearchResultGroup();
    this._searchField = this._search.getElement().querySelector(`.search__field`);

    this._onDataChange = this._onDataChange.bind(this);
    this._onCommentsChange = this._onCommentsChange.bind(this);
    this._onResetButtonClick = this._onResetButtonClick.bind(this);
    this._onInputKeyup = this._onInputKeyup.bind(this);

    this._filmsListController = new FilmsListController(
        this._searchResultGroup.getElement().querySelector(`.films-list__container`), this._onDataChange, this._onCommentsChange);
  }

  show(films) {
    this._films = films;
    this._render();
    this._findSuitable(this._searchInput);
  }

  hide() {
    this._unrender();
  }

  _render() {
    render(this._container, this._searchResultInfo.getElement(), Position.AFTERBEGIN);
    render(this._container, this._searchResultGroup.getElement(), Position.BEFOREEND);

    this._search.getElement().querySelector(`.search__reset`).addEventListener(`click`, this._onResetButtonClick);
    this._searchField.addEventListener(`keyup`, debounce(this._onInputKeyup, 400));
  }

  _findSuitable(text) {
    this._searchInput = text;
    const films = this._films.filter((film) => film.title.toLowerCase().includes(text.toLowerCase()));
    this._showSearchResult(text, films);
  }

  _showSearchResult(text, films) {
    if (this._searchResultInfo) {
      unrender(this._searchResultInfo.getElement());
      this._searchResultInfo.removeElement();
    }

    this._searchResultInfo = new SearchResultInfo({counter: films.length});
    render(this._container, this._searchResultInfo.getElement(), Position.AFTERBEGIN);
    this._filmsListController.set(films);
  }

  _unrender() {
    unrender(this._searchResultInfo.getElement());
    unrender(this._searchResultGroup.getElement());
  }

  _onInputKeyup(evt) {
    const {value} = evt.target;
    if (!value) {
      return this._onResetButtonClick();
    }
    if (value.length >= MIN_SEARCH_LENGTH) {
      this._findSuitable(value);
    }

    return null;
  }

  _onResetButtonClick() {
    this._searchField.value = ``;
    this._searchField.blur();
    this._searchInput = ``;
    this._onClearSearch();
  }

  _onDataChange(newFilmData) {
    this._onDataChangeMain(newFilmData, true);
  }

  _onCommentsChange(commentActivity) {
    this._onCommentsChangeMain(commentActivity, true);
  }
}

export default SearchController;
