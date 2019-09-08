import DefaultComponent from './default-component';
import {STATISTICS_FILTERS, RATINGS} from '../config';
import moment from 'moment';

class Statistics extends DefaultComponent {
  constructor({rank, watchedQuantity, watchedDuration, topGenre, currentFilter}) {
    super();
    this._rank = rank;
    this._watchedQuantity = watchedQuantity;
    this._watchedDuration = watchedDuration;
    this._topGenre = topGenre;
    this._currentFilter = currentFilter;
  }

  getTemplate() {
    return `
     <section class="statistic visually-hidden">
      ${this._rank ? `<p class="statistic__rank">Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"> 
        <span class="statistic__rank-label">
          ${RATINGS.filter((item) => item.minRating <= this._rank).pop().title}
        </span>
      </p>`.trim() : ``}
   
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${STATISTICS_FILTERS.map((filter) => `
          <input 
            type="radio" 
            class="statistic__filters-input visually-hidden" 
            name="statistic-filter" 
            id="statistic-${filter.value}" 
            value="${filter.value}"
            ${this._currentFilter === filter.value ? `checked` : ``}>
          <label for="statistic-${filter.value}" class="statistic__filters-label">${filter.title}</label>`.trim()).join(``)}
      </form>
    
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${this._watchedQuantity || 0} 
            <span class="statistic__item-description">movies</span>
          </p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${moment.duration(this._watchedDuration, `minutes`).hours() || 0}
            <span class="statistic__item-description">h</span>${moment.duration(this._watchedDuration, `minutes`).minutes() || 0}
            <span class="statistic__item-description">m</span>
          </p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${this._topGenre || `Don't know`}</p>
        </li>
      </ul>
    
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
     </section>
   `.trim();
  }
}

export default Statistics;
