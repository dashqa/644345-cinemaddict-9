import {truncateString} from '../utils';
import {PIC_PATH, MAX_DESCRIPTION_LENGTH, FILM_CONTROLS} from '../config';
import DefaultComponent from "./default-component";
import moment from 'moment';
import 'moment-duration-format';

class FilmCard extends DefaultComponent {
  constructor({title, rating, releaseDate, duration, genres, picture, description, comments, inWatchlist, isWatched, isFavorite, userRating}) {
    super();
    this._title = title;
    this._rating = rating;
    this._releaseDate = releaseDate;
    this._duration = duration;
    this._genres = genres;
    this._picture = picture;
    this._description = description;
    this._commentsQuantity = comments.length;
    this._inWatchlist = inWatchlist;
    this._isWatched = isWatched;
    this._isFavorite = isFavorite;
    this._userRating = userRating;
  }

  _getDataByControlType(type) {
    switch (type) {
      case `watchlist`:
        return this._inWatchlist;
      case `watched`:
        return this._isWatched;
      case `favorite`:
        return this._isFavorite;
    }
    return null;
  }

  getTemplate() {
    return `
    <article class="film-card">
      <h3 class="film-card__title">${this._title}</h3>
      <p class="film-card__rating">${this._rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${moment(this._releaseDate).format(`YYYY`)}</span>
        <span class="film-card__duration">${moment.duration(this._duration, `minutes`).format(`h[h] m[m]`)}</span>
        ${Array.from(this._genres).map((genre) => `
        <span class="film-details__genre">${genre}</span>`.trim()).join(``)}
      </p>
      <img src="${PIC_PATH}/${this._picture}" alt="${this._title}" class="film-card__poster">
      <p class="film-card__description">${truncateString(this._description, MAX_DESCRIPTION_LENGTH)}</p>
      <a class="film-card__comments">${this._commentsQuantity} comments</a>
      <form class="film-card__controls">
      ${FILM_CONTROLS.map(({title, value, button}) => `
       <button 
          class="film-card__controls-item button film-card__controls-item--${button} ${this._getDataByControlType(value) ? `film-card__controls-item--active` : ``}"
          data-action="${value}">${title}</button>
      `.trim()).join(``)}
      </form>
    </article>
    `.trim();
  }
}

export default FilmCard;

