import {getFiltersComponent} from "./filter";

export const getNavComponent = (filters) => {
  return `
    <nav class="main-navigation">
      ${getFiltersComponent(filters)}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>
  `;
};
