import Filter from '../components/filter';
import {render, getFilteredFilmsArray} from '../utils';
import {Position} from '../config';

class FilterController {
  constructor(container, filter) {
    this._container = container;
    this._filter = filter;
    this._title = this._filter.title;
    this._id = this._filter.id;
    this._isCountable = this._filter.isCountable;
    this._isActive = this._id === `all`;
    this._isAdditional = this._id === `stats`;
    this._count = null;
  }

  setFilter(films) {
    this._count = (getFilteredFilmsArray(films, this._id) || []).length;
    this._render();
  }

  _render() {
    this._filter = new Filter({
      title: this._title,
      count: this._count,
      id: this._id,
      isActive: this._isActive,
      isAdditional: this._isAdditional,
      isCountable: this._isCountable,
    });

    render(this._container, this._filter.getElement(), Position.BEFOREEND);
  }
}

export default FilterController;
