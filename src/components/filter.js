export const getFilters = (filters) => {
  return filters.map((filter) => getFilterMarkup(filter)).join(``);
};

export const getFilterMarkup = ({title, count, isMain = false}) => {
  return `
    <a href="#" class="main-navigation__item">${title}
      ${!isMain ? `<span class="main-navigation__item-count">${count}</span>` : ``}
    </a>
  `;
};
