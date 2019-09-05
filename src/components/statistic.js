import {STATISTICS_FILTERS} from '../config';
import DefaultComponent from './default-component';

class Statistics extends DefaultComponent {
  constructor({rank, watchedQuantity, watchedDuration, topGenre}) {
    super();
    this._rank = rank;
    this._watchedQuantity = watchedQuantity;
    this._watchedDuration = watchedDuration;
    this._topGenre = topGenre;
  }

  getTemplate() {
    return `
     <section class="statistic visually-hidden">
      ${this._rank ? `<p class="statistic__rank">Your rank 
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"> 
      <span class="statistic__rank-label">${this._rank}</span></p>`.trim() : ``}
   
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${STATISTICS_FILTERS.map((filter) => `
          <input 
            type="radio" 
            class="statistic__filters-input visually-hidden" 
            name="statistic-filter" 
            id="statistic-${filter.value}" 
            value="${filter.value}" 
            ${filter.isChecked ? `checked` : ``}>
          <label for="statistic-all-time" class="statistic__filters-label">${filter.title}</label>`.trim()).join(``)}
      </form>
    
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${this._watchedQuantity} 
            <span class="statistic__item-description">movies</span>
          </p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${this._watchedDuration} 
            <span class="statistic__item-description">h</span>${this._watchedDuration}
            <span class="statistic__item-description">m</span>
          </p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${this._topGenre}</p>
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
