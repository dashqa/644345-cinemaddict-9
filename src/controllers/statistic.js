import {mostFrequents, findCounts, unrender, render} from '../utils';
import Statistics from '../components/statistic';
import {Position, StatisticBar} from '../config';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

class StatisticController {
  constructor(container, statistic, rank) {
    this._rank = rank;
    this._container = container;
    this._statistic = statistic;
    this._currentFilter = `all-time`;

    this._films = [];
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
    if (films !== this._films) {
      this._setData(films, condition);
      this._renderStatistic();
    }

    this._statistic.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._statistic.getElement().classList.add(`visually-hidden`);
  }

  _setData(films, condition = `new`) {
    if (condition === `new`) {
      this._watchedFilms = films.filter((film) => film.isWatched);
      this._filteredFilms = this._watchedFilms;
    } else {
      this._filteredFilms = films;
    }

    this._watchedQuantity = this._filteredFilms.length;
    this._watchedDuration = this._filteredFilms.reduce((sum, film) => sum + film.duration, 0);
    this._allGenres = this._filteredFilms.map((film) => [...film.genre]).reduce((array, genre) => array.concat(genre));
    this._topGenre = mostFrequents(this._allGenres)[0];
  }

  _renderStatistic() {
    this._unrenderStatistic();

    this._statistic = new Statistics({
      rank: this._rank,
      watchedQuantity: this._watchedQuantity,
      watchedDuration: this._watchedDuration,
      topGenre: this._topGenre,
      currentFilter: this._currentFilter,
    });

    render(this._container, this._statistic.getElement(), Position.BEFOREEND);
    this.initChart();

    this._statistic.getElement().querySelectorAll(`.statistic__filters-input`)
      .forEach((input) => input.addEventListener(`click`, this._onFilterClick));
  }

  _unrenderStatistic() {
    if (this._statistic) {
      unrender(this._statistic.getElement());
      this._statistic.removeElement();
    }
  }

  _onFilterClick(evt) {
    const getFilteredFilms = () => {
      switch (evt.target.value) {
        case `all-time`:
          return this._watchedFilms;
        case `today`:
          return this._watchedFilms.filter((film) => moment().isSame(moment(film.watchedDate), `day`));
        case `week`:
          return this._watchedFilms.filter((film) => moment(film.watchedDate) > moment().subtract(1, `w`));
        case `month`:
          return this._watchedFilms.filter((film) => moment(film.watchedDate) > moment().subtract(1, `months`));
        case `year`:
          return this._watchedFilms.filter((film) => moment(film.watchedDate) > moment().subtract(1, `y`));
      }
      return null;
    };

    this._currentFilter = evt.target.value;
    this.show(getFilteredFilms(), `update`);
  }

  initChart() {
    const canvas = this._statistic.getElement().querySelector(`.statistic__chart`);
    this._chart = new Chart(canvas, this._getChart());
  }

  _getChart() {
    const labels = Object.keys(findCounts(this._allGenres));
    const data = Object.values(findCounts(this._allGenres));

    const barData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: StatisticBar.data.backgroundColor,
          hoverBackgroundColor: StatisticBar.data.hoverBackgroundColor,
          anchor: StatisticBar.data.anchor,
        },
      ],
    };
    const barOptions = {
      plugins: {
        datalabels: {
          font: {size: StatisticBar.options.datalabel.fontSize},
          color: StatisticBar.options.datalabel.color,
          anchor: StatisticBar.options.datalabel.anchor,
          align: StatisticBar.options.datalabel.align,
          offset: StatisticBar.options.datalabel.offset,
        },
      },
      animation: {
        easing: StatisticBar.options.animationEasing
      },
      scales: {
        yAxes: [{
          barThickness: StatisticBar.options.yAxes.barThickness,
          ticks: {
            fontColor: StatisticBar.options.yAxes.ticks.fontColor,
            padding: StatisticBar.options.yAxes.ticks.padding,
            fontSize: StatisticBar.options.yAxes.ticks.fontSize,
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
}

export default StatisticController;
