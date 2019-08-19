import {getFilmListSections} from './film-list-section';

export const getFilmSectionMarkup = (sections) => {
  return ` 
     <section class="films">${getFilmListSections(sections)}</section>
  `;
};

