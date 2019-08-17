import {getShowMoreComponent} from './show-more';

export const getFilmListSectionComponent = (sections) => {
  return sections.map((section) => renderFilmListSection(section)).join(``);
};

export const renderFilmListSection = ({title, isExtra = false, isDisplay = true}) => {
  return `
    ${isDisplay ?
    `<section class="${isExtra ? `films-list--extra` : `films-list`}">
      <h2 class="films-list__title ${!isExtra ? `visually-hidden` : ``}">
        ${title}
      </h2>
      <div class="films-list__container"></div>
      ${!isExtra ? `${getShowMoreComponent()}` : ``}
    </section>` : ``}
  `;
};
