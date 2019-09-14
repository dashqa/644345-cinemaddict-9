import NavMenu from '../components/nav-menu';
import FilterController from '../controllers/filter';
import {getFilteredFilmsArray, render, unrender} from '../utils';
import {Position, FILTERS} from '../config';

class NavController {
  constructor(container, showStatistic, showFilteredFilms) {
    this._container = container;
    this._showStatistic = showStatistic;
    this._showFilteredFilms = showFilteredFilms;
    this._nav = new NavMenu();
    this._films = [];
    this._currentFilter = `all`;
    this._filtersController = null;

    this._onNavLinkClick = this._onNavLinkClick.bind(this);
  }

  show(films) {
    this._films = films;
    this._render();
  }

  hide() {
    this._unrender();
  }

  _render() {
    this._unrender();

    render(this._container, this._nav.getElement(), Position.AFTERBEGIN);

    this._filtersController = FILTERS.map((filter) => new FilterController(this._nav.getElement(), filter));
    this._filtersController.forEach((filter) => filter.set(this._films));

    this._nav.getElement().querySelectorAll(`.main-navigation__item`)
      .forEach((link) => link.addEventListener(`click`, this._onNavLinkClick));
  }

  _unrender() {
    if (this._nav) {
      unrender(this._nav.getElement());
      this._nav.removeElement();
    }
  }

  _onNavLinkClick(evt) {
    const currentActiveElement = this._nav.getElement().querySelector(`.main-navigation__item--active`);
    if (evt.target === currentActiveElement) {
      return;
    }

    this._currentFilter = evt.target.hash.replace(`#`, ``);

    currentActiveElement.classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);

    if (evt.target.classList.contains(`main-navigation__item--additional`)) {
      this._showStatistic();
    } else {
      this._showFilteredFilms(getFilteredFilmsArray(this._films, this._currentFilter));
    }
  }
}

export default NavController;
