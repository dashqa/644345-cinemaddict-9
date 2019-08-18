import {PIC_PATH} from "../../config";

const renderRatingScore = () => {
  return [...Array(9)].map((_,i) => {
    const value = i + 1;
    return `
      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${value}" 
      id="rating-${value}">
      <label class="film-details__user-rating-label" for="rating-${value}">${value}</label>`;
  }).join(` `);
};

export const getDetailsRatingMarkup = (title, picture) => {
  return `
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${PIC_PATH}/${picture}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>
            <p class="film-details__user-rating-feelings">How you feel it?</p>
            <div class="film-details__user-rating-score">
             ${renderRatingScore()}
            </div>
          </section>
        </div>
      </section>
  `;
};
