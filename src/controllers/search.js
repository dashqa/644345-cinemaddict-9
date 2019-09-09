import SearchResultInfo from '../components/search/search-result-info';
import SearchResultGroup from '../components/search/search-result-group';
import FilmsListController from '../controllers/film-list';
import {render, unrender} from '../utils';
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

    this._onDataChange = this._onDataChange.bind(this);
    this._onCommentsChange = this._onCommentsChange.bind(this);
    this._onResetButtonClick = this._onResetButtonClick.bind(this);
    this._onInputKeyup = this._onInputKeyup.bind(this);

    this._filmsListController = new FilmsListController(
        this._searchResultGroup.getElement().querySelector(`.films-list__container`), this._onDataChange, this._onCommentsChange);
  }

  hide() {
    this._unrender();
  }

  show(films) {
    this._films = films;
    this._render();
    this._findSuitable(this._searchInput);
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

  _showSearchResult(text, films) {
    if (this._searchResultInfo) {
      unrender(this._searchResultInfo.getElement());
      this._searchResultInfo.removeElement();
    }

    this._searchResultInfo = new SearchResultInfo({counter: films.length});
    render(this._container, this._searchResultInfo.getElement(), Position.AFTERBEGIN);
    this._filmsListController.setFilms(films);
  }

  _findSuitable(text) {
    if (!text) {
      return this._onClearSearch();
    }

    if (text.length >= MIN_SEARCH_LENGTH) {
      this._searchInput = text;

      const films = this._films.filter((film) => film.title.toLowerCase().includes(text.toLowerCase()));
      this._showSearchResult(text, films);
    }

    return null;
  }

  _onInputKeyup(evt) {
    const {value} = evt.target;
    this._findSuitable(value);
  }

  _onResetButtonClick() {
    this._search.getElement().querySelector(`input`).value = ``;
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
