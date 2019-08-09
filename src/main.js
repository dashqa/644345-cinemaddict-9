import { getSearchMarkup } from "./components/search";
import { getNavMenuMarkup } from "./components/nav-menu";
import { getProfileMarkup } from "./components/profile";
import { getSortingMarkup } from "./components/sorting";
import { getFilmSectionMarkup } from "./components/film-section";
import { getFilmListSectionMarkup } from "./components/film-list-section";
import { getCardMarkup } from "./components/film-card";
import { getShowMoreMarkup } from "./components/show-more";

const filmSections = [
  {
    title: `All movies. Upcoming`,
    cardsQuantity: 5,
    isExtra: false
  },
  {
    title: `Top rated movies`,
    cardsQuantity: 2,
    isExtra: true
  },
  {
    title: `Most commented`,
    cardsQuantity: 2,
    isExtra: true
  }
];
const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);


const renderComponent = (container, markup, quantity = 1) => {
  for (let i = 0; i < quantity; i++) {
    container.insertAdjacentHTML(`beforeend`, markup);
  }
};

const renderFilmsBoard = () => {
  const filmsElement = document.querySelector(`.films`);

  filmSections.forEach((section, index) => {
    renderComponent(filmsElement, getFilmListSectionMarkup(section.title, section.isExtra));
    let filmListElement = filmsElement.children[index];
    let filmListContainer = filmListElement.querySelector(`.films-list__container`);

    renderComponent(filmListContainer, getCardMarkup(), section.cardsQuantity);

    if(!section.isExtra) {
      renderComponent(filmListElement, getShowMoreMarkup());
    }
  });
};

renderComponent(headerContainer, getSearchMarkup());
renderComponent(headerContainer, getProfileMarkup());
renderComponent(mainContainer, getNavMenuMarkup());
renderComponent(mainContainer, getSortingMarkup());
renderComponent(mainContainer, getFilmSectionMarkup());
renderFilmsBoard();
