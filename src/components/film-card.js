import {truncateString} from '../utils';
import {PIC_PATH, MAX_DESCRIPTION_LENGTH} from '../config';
import DefaultComponent from "./default-component";

class FilmCard extends DefaultComponent {
  constructor({title, rating, year, duration, genres, picture, description, comments}) {
    super();
    this._title = title;
    this._rating = rating;
    this._year = year;
    this._duration = duration;
    this._genres = genres;
    this._picture = picture;
    this._description = description;
    this._commentsQuantity = comments.length;
  }

  getTemplate() {
    return `
    <article class="film-card">
      <h3 class="film-card__title">${this._title}</h3>
      <p class="film-card__rating">${this._rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${this._year}</span>
        <span class="film-card__duration">${this._duration}</span>
        ${Array.from(this._genres).map((genre) => `
        <span class="film-details__genre">${genre}</span>`.trim()).join(``)}
      </p>
      <img src="${PIC_PATH}/${this._picture}" alt="${this._title}" class="film-card__poster">
      <p class="film-card__description">${truncateString(this._description, MAX_DESCRIPTION_LENGTH)}</p>
      <a class="film-card__comments">${this._commentsQuantity} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>
    `.trim();
  }
}

export default FilmCard;

