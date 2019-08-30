import {PIC_PATH, FILM_DETAILS_CONTROLS} from '../config';
import DefaultComponent from './default-component';

class FilmCardDetails extends DefaultComponent {
  constructor({title, originalTitle, minAge, rating, director, writers, actors, releaseDate, duration, country, genres,
    description, picture, comments, inWatchlist, isWatched, isFavorite}) {
    super();
    this._title = title;
    this._originalTitle = originalTitle;
    this._minAge = minAge;
    this._rating = rating;
    this._director = director;
    this._writers = writers;
    this._actors = actors;
    this._releaseDate = releaseDate;
    this._duration = duration;
    this._country = country;
    this._genres = genres;
    this._description = description;
    this._picture = picture;
    this._comments = comments;
    this._inWatchlist = inWatchlist;
    this._isWatched = isWatched;
    this._isFavorite = isFavorite;
  }

  _getRatingScoreTemplate() {
    return [...Array(9)].map((_, i) => {
      const value = i + 1;
      return `
      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${value}" 
      id="rating-${value}">
      <label class="film-details__user-rating-label" for="rating-${value}">${value}</label>`.trim();
    }).join(` `);
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
  }

  getTemplate() {
    return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${PIC_PATH}/${this._picture}" alt="${this._title}">
              <p class="film-details__age">${this._minAge}+</p>
            </div>
    
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${this._title}</h3>
                  <p class="film-details__title-original">Original: ${this._originalTitle}</p>
                </div>
    
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${this._rating}</p>
                </div>
              </div>
    
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${this._director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${this._writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${this._actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${this._releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${this._duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${this._country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                  ${Array.from(this._genres).map((genre) => `
                    <span class="film-details__genre">${genre}</span>`.trim()).join(``)}
                  </td>
                </tr>
              </table>
              <p class="film-details__film-description">
                ${this._description}
              </p>
            </div>
          </div>
    
          <section class="film-details__controls">
          ${FILM_DETAILS_CONTROLS.map(({title, value}) => `
            <input 
              type="checkbox" 
              class="film-details__control-input visually-hidden" 
              id="${value}" 
              name="${value}"
              ${this._getDataByControlType(value) ? `checked` : ``}>
            <label for="${value}" class="film-details__control-label film-details__control-label--${value}">${title}</label>
          `.trim()).join(``)}
          </section>
        </div>
        
        ${this._isWatched ? `
          <div class="form-details__middle-container" >
          <section class="film-details__user-rating-wrap">
            <div class="film-details__user-rating-controls">
              <button class="film-details__watched-reset" type="button">Undo</button>
            </div>
            <div class="film-details__user-score">
              <div class="film-details__user-rating-poster">
              <img src="${PIC_PATH}/${this._picture}" alt="film-poster" class="film-details__user-rating-img">
             </div>
             
             <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${this._title}</h3>
              <p class="film-details__user-rating-feelings">How you feel it?</p>
              <div class="film-details__user-rating-score">
               ${this._getRatingScoreTemplate()}
              </div>
          </section>
        </div>
      </section>
        </div>`.trim() : ``}
        
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments 
            <span class="film-details__comments-count">${this._comments.length}</span></h3>
        
            <ul class="film-details__comments-list">
            ${this._comments.map(({text, author, date}) => `
              <li class="film-details__comment">
                <span class="film-details__comment-emoji">
                  <img src="./images/emoji/smile.png" width="55" height="55" alt="emoji">
                </span>
                <div>
                  <p class="film-details__comment-text">${text}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${author}</span>
                    <span class="film-details__comment-day">${date} 3 days ago</span>
                    <button class="film-details__comment-delete">Delete</button>
                  </p>
                </div>
              </li>`.trim()).join(``)}
            </ul>
        
            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>
        
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
        
              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>
        
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>
        
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
                <label class="film-details__emoji-label" for="emoji-gpuke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>
        
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
           </section>
        </div>
      </form>
    </section>
    `.trim();
  }
}

export default FilmCardDetails;
