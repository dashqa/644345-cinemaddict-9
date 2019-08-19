import {getFilters} from "./filter";

export const getNavMarkup = (filters) => {
  return `
    <nav class="main-navigation">
      ${getFilters(filters)}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>
  `;
};
