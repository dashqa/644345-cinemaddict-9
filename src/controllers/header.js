import Search from '../components/search';
import Profile from '../components/profile';
import {render} from '../utils';
import {Position} from '../config';


class HeaderController {
  constructor(container) {
    this._container = container;
    this._search = new Search();
    this._profile = new Profile();
  }

  init() {
    render(this._container, this._search.getElement(), Position.BEFOREEND);
    render(this._container, this._profile.getElement(), Position.BEFOREEND);
  }
}

export default HeaderController;
