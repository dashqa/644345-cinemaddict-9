import Statistics from '../components/statistic';
import {mostFrequents, findCounts, getFilteredFilmsArray, getWatchedFilmsByPeriod, unrender, render} from '../utils';
import {Position, StatisticBar} from '../config';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

class StatisticController {
  constructor(container) {
    this._container = container;
    this._statistic = null;
    this._currentFilter = `all-time`;

    this._watchedFilms = [];
    this._filteredFilms = [];
    this._watchedQuantity = null;
    this._watchedDuration = null;
    this._allGenres = [];
    this._topGenre = null;
    this._chart = null;

    this._onFilterClick = this._onFilterClick.bind(this);
  }


  show(films, condition) {
    this._set(films, condition);
    this._render();
  }

  hide() {
    this._unrender();
  }

  _set(films, condition = `new`) {
    if (condition === `new`) {
      this._watchedFilms = getFilteredFilmsArray(films, `history`);
      this._filteredFilms = getWatchedFilmsByPeriod(this._watchedFilms, this._currentFilter);
    } else {
      this._filteredFilms = films;
    }

    this._watchedQuantity = this._filteredFilms.length;
    this._watchedDuration = this._filteredFilms.reduce((sum, film) => sum + film.duration, 0);
    this._allGenres = this._filteredFilms.map((film) => [...film.genre]).reduce((array, genre) => array.concat(genre));
    this._topGenre = mostFrequents(this._allGenres)[0];
  }

  _initChart() {
    const canvasElement = this._statistic.getElement().querySelector(`.statistic__chart`);
    this._chart = new Chart(canvasElement, this._getChart());
  }

  _render() {
    this._unrender();

    this._statistic = new Statistics({
      rank: this._watchedFilms.length,
      watchedQuantity: this._watchedQuantity,
      watchedDuration: this._watchedDuration,
      topGenre: this._topGenre,
      currentFilter: this._currentFilter,
    });

    render(this._container, this._statistic.getElement(), Position.BEFOREEND);
    this._initChart();

    this._statistic.getElement().querySelectorAll(`.statistic__filters-input`)
      .forEach((input) => input.addEventListener(`click`, this._onFilterClick));
  }

  _unrender() {
    if (this._statistic) {
      unrender(this._statistic.getElement());
      this._statistic.removeElement();
    }
  }

  _getChart() {
    const labels = Object.keys(findCounts(this._allGenres));
    const data = Object.values(findCounts(this._allGenres));

    const barData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: StatisticBar.DATA.backgroundColor,
          hoverBackgroundColor: StatisticBar.DATA.hoverBackgroundColor,
          anchor: StatisticBar.DATA.anchor,
        },
      ],
    };
    const barOptions = {
      plugins: {
        datalabels: {
          font: {size: StatisticBar.OPTIONS.datalabel.fontSize},
          color: StatisticBar.OPTIONS.datalabel.color,
          anchor: StatisticBar.OPTIONS.datalabel.anchor,
          align: StatisticBar.OPTIONS.datalabel.align,
          offset: StatisticBar.OPTIONS.datalabel.offset,
        },
      },
      animation: {
        easing: StatisticBar.OPTIONS.animationEasing
      },
      scales: {
        yAxes: [{
          barThickness: StatisticBar.OPTIONS.yAxes.barThickness,
          ticks: {
            fontColor: StatisticBar.OPTIONS.yAxes.ticks.fontColor,
            padding: StatisticBar.OPTIONS.yAxes.ticks.padding,
            fontSize: StatisticBar.OPTIONS.yAxes.ticks.fontSize,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
        }],
      },
      legend: {display: false},
      tooltips: {enabled: false},
    };

    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: barData,
      options: barOptions,
    };
  }

  _onFilterClick(evt) {
    this._currentFilter = evt.target.value;
    this.show(getWatchedFilmsByPeriod(this._watchedFilms, evt.target.value), `update`);
  }
}

export default StatisticController;
