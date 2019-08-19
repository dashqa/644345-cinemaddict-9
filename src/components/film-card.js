import {truncateString} from '../utils';
import {PIC_PATH, MAX_DESCRIPTION_LENGTH} from '../config';

export const getCards = (films) => {
  return films.map((film) => getCardMarkup(film)).join(``);
};

export const getCardMarkup = ({title, rating, year, duration, genres, picture, description}) => {
  return `
    <article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        ${Array.from(genres).map((genre) => `<span class="film-card__genre">${genre}</span>`).join(``)}
      </p>
      <img src="${PIC_PATH}/${picture}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${truncateString(description, MAX_DESCRIPTION_LENGTH)}</p>
      <a class="film-card__comments">5 comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>
  `;
};
