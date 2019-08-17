import {getFilmListSectionComponent} from './film-list-section';

export const getFilmSectionComponent = (sections) => {
  return ` 
     <section class="films">${getFilmListSectionComponent(sections)}</section>
  `;
};

