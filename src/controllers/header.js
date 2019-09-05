// import Search from '../components/search/search';
// import Profile from '../components/profile';
// import SearchController from '../controllers/search';
// import {render} from '../utils';
// import {Position, PageElement} from '../config';
//
//
// class HeaderController {
//   constructor(container, films) {
//     this._container = container;
//     this._films = films;
//     this._search = new Search();
//     this._profile = new Profile();
//
//     this._searchController = new SearchController(PageElement.MAIN, this._search);
//     this._onSearchClick = this._onSearchClick.bind(this);
//   }
//
//   init() {
//     render(this._container, this._search.getElement(), Position.BEFOREEND);
//     render(this._container, this._profile.getElement(), Position.BEFOREEND);
//     this._search.getElement().addEventListener(`click`, this._onSearchClick());
//   }
//
//   _onSearchClick() {
//     // statistics.getElement().classList.add(`visually-hidden`);
//     // boardController.hide();
//     this._searchController.show(this._films);
//   }
// }
//
// export default HeaderController;
