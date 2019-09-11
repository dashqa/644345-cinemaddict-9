import {RATINGS} from '../config';
import DefaultComponent from './default-component';

class Profile extends DefaultComponent {
  constructor({userRating}) {
    super();
    this._userRating = userRating || 0;
  }

  getTemplate() {
    return `
      <section class="header__profile profile">
      ${this._userRating > 0 ? `<p class="profile__rating">
        ${RATINGS.filter((item) => item.minRating <= this._userRating).pop().title}</p>` : ``} 
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>
  `.trim();
  }
}

export default Profile;
