export const getFiltersComponent = (filters) => {
  return filters.map((filter) => renderFilter(filter)).join(``);
};

export const renderFilter = ({title, count}) => {
  return `
    <a href="#" class="main-navigation__item">${title}
      ${title !== `All movies` ? `<span class="main-navigation__item-count">${count}</span>` : ``}
    </a>
  `;
};
