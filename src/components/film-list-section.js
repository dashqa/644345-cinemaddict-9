import {getShowMoreMarkup} from './show-more';

export const getFilmListSections = (sections) => {
  return sections.map((section) => getFilmListSectionMarkup(section)).join(``);
};

export const getFilmListSectionMarkup = ({title, isExtra = false}) => {
  return `
    <section class="${isExtra ? `films-list--extra` : `films-list`}">
      <h2 class="films-list__title ${!isExtra ? `visually-hidden` : ``}">
        ${title}
      </h2>
      <div class="films-list__container"></div>
      ${!isExtra ? getShowMoreMarkup() : ``}
    </section>
  `;
};
