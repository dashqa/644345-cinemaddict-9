import DefaultComponent from './default-component';
import moment from 'moment';

class FilmComment extends DefaultComponent {
  constructor({id, comment, author, date, emotion}) {
    super();
    this._id = id;
    this._comment = comment;
    this._author = author;
    this._date = date;
    this._emotion = emotion;
  }

  _humanizeTime(date) {
    const inMinutes = moment().diff(date, `minutes`);
    switch (true) {
      case inMinutes < 1:
        return `now`;
      case inMinutes <= 3:
        return `a minute ago`;
      case inMinutes <= 59:
        return `a few minutes ago`;
      case inMinutes <= 119:
        return `an hour ago`;
      case inMinutes <= 1439:
        return `a few hours ago`;
      case inMinutes >= 1440:
        return moment(date).fromNow();
    }
    return null;
  }

  getTemplate() {
    return `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${this._emotion}.png" width="55" height="55" alt="emoji">
        </span>
        <div>
          <p class="film-details__comment-text">${this._comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${this._author}</span>
            <span class="film-details__comment-day">${this._humanizeTime(this._date)}</span>
            <button data-id="${this._id}" class="film-details__comment-delete" >Delete</button>
          </p>
        </div>
      </li>`.trim();
  }
}

export default FilmComment;
