import {PIC_PATH, FILM_CONTROLS, EMOJIS} from '../config';
import {unrender} from '../utils';
import DefaultComponent from './default-component';

class FilmCardDetails extends DefaultComponent {
  constructor({title, originalTitle, minAge, rating, director, writers, actors, releaseDate, duration, country, genres,
    description, picture, comments, inWatchlist, isWatched, isFavorite, userRating}) {
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
    this._userRating = userRating;

    this._onChangeWatchedStatus = this._onChangeWatchedStatus.bind(this);
    this._onResetUserRating = this._onResetUserRating.bind(this);
    this._onAddCommentEnterKey = this._onAddCommentEnterKey.bind(this);
    this._onChangeEmojiReaction = this._onChangeEmojiReaction.bind(this);
    this._onCommentDelete = this._onCommentDelete.bind(this);

    this._subscribeOnEvents();
  }

  _getRatingScoreTemplate() {
    return [...Array(9)].map((_, i) => {
      const value = i + 1;
      return `
      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${value}" 
      id="rating-${value}"
      ${parseInt(this._userRating, 10) === i ? `checked` : ``}>
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
    return null;
  }

  _onAddCommentEnterKey(evt) {
    if (!(evt.key === `Enter` && (evt.ctrlKey || evt.metaKey))) {
      return;
    }
    evt.preventDefault();
    evt.stopPropagation();

    const checkedEmoji = [...this._element.querySelectorAll(`input[name=comment-emoji]`)].filter((input) => input.checked)[0];

    if (checkedEmoji) {
      this._element.querySelector(`.film-details__comments-list`)
        .insertAdjacentHTML(`beforeend`, `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${checkedEmoji.value}.png" width="55" height="55" alt="emoji">
          </span>
          <div>
            <p class="film-details__comment-text">${evt.target.value}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">автор</span>
              <span class="film-details__comment-day">${new Date()} 3 days ago</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`);

      this._element.querySelectorAll(`.film-details__comment-delete`).forEach((button) => {
        button.addEventListener(`click`, this._onCommentDelete);
      });
    }

    evt.target.value = ``;
  }

  _onCommentDelete(evt) {
    evt.target.parentNode.parentNode.parentElement.remove();
  }

  _onChangeEmojiReaction(evt) {
    evt.preventDefault();
    const reactionImage = this._element.querySelector(`.film-details__add-emoji-label`).firstElementChild;
    reactionImage.src = `/images/emoji/${evt.target.value}.png`;
  }

  _onResetUserRating() {
    const checkedInput = [...this._element.querySelectorAll(`input[name=score]`)].filter((input) => input.checked)[0];
    if (checkedInput) {
      checkedInput.checked = false;
    }
  }

  _onChangeWatchedStatus() {
    const filmDetailsMiddle = this._element.querySelector(`.form-details__middle-container`);

    if (filmDetailsMiddle) {
      unrender(filmDetailsMiddle);
    } else {
      this._element.querySelector(`.form-details__top-container`)
        .insertAdjacentHTML(`afterend`, `<div class="form-details__middle-container">
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
         </div>`);
      this._element.querySelector(`.film-details__watched-reset`).addEventListener(`click`, this._onResetUserRating);
    }
  }

  _subscribeOnEvents() {
    this.getElement().querySelector(`#watched`).addEventListener(`change`, this._onChangeWatchedStatus);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._onAddCommentEnterKey);
    this.getElement().querySelectorAll(`.film-details__emoji-item`)
      .forEach((input) => input.addEventListener(`change`, this._onChangeEmojiReaction));
    this.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((button) => {
      button.addEventListener(`click`, this._onCommentDelete);
    });
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
          ${FILM_CONTROLS.map(({title, value}) => `
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
        
        ${this._isWatched && !this._userRating ? `
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
              <div for="add-emoji" class="film-details__add-emoji-label">
                <img src="images/emoji/smile.png" width="55" height="55" alt="emoji">
              </div>
        
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
        
              <div class="film-details__emoji-list">
              ${EMOJIS.map((emoji, index) => `
              <input 
                class="film-details__emoji-item visually-hidden" 
                name="comment-emoji" 
                type="radio" 
                id="emoji-${emoji}" 
                value="${emoji}" 
                ${index === 0 ? `checked` : ``}>
                <label class="film-details__emoji-label" for="emoji-${emoji}">
                  <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
                </label>`.trim()).join(``)}
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
