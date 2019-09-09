export const MAX_DESCRIPTION_LENGTH = 139;
export const CARDS_PER_PAGE = 5;
export const MIN_SEARCH_LENGTH = 3;
export const EMOJIS = [`smile`, `sleeping`, `puke`, `angry`];

export const STATISTIC_FILTERS = [
  {title: `All time`, value: `all-time`},
  {title: `Today`, value: `today`},
  {title: `Week`, value: `week`},
  {title: `Month`, value: `month`},
  {title: `Year`, value: `year`},
];

export const RATINGS = [
  {title: `Novice`, minRating: 1},
  {title: `Fan`, minRating: 10},
  {title: `Movie Buff`, minRating: 21}
];

export const FILM_SECTIONS = [
  {title: `All movies. Upcoming`, isExtra: false},
  {title: `Top rated movies`, isExtra: true},
  {title: `Most commented`, isExtra: true}
];

export const FILM_CONTROLS = [
  {title: `Add to watchlist`, value: `watchlist`, button: `add-to-watchlist`},
  {title: `Already watched`, value: `watched`, button: `mark-as-watched`},
  {title: `Add to favorites`, value: `favorite`, button: `favorite`}
];

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const PageElement = {
  BODY: document.querySelector(`body`),
  MAIN: document.querySelector(`.main`),
  HEADER: document.querySelector(`.header`),
  FOOTER_STATISTICS: document.querySelector(`.footer`),
};

export const Api = {
  AUTHORIZATION: `Basic blablabla11`,
  END_POINT: `https://htmlacademy-es-9.appspot.com/cinemaddict`,
};

export const StatisticBar = {
  data: {
    backgroundColor: `#ffe800`,
    hoverBackgroundColor: `#ffe800`,
    anchor: `start`,
  },
  options: {
    datalabel: {
      fontSize: 25,
      color: `#ffffff`,
      anchor: `start`,
      align: `start`,
      offset: 40,
    },
    animationEasing: `easeOutQuart`,
    yAxes: {
      barThickness: 30,
      ticks: {
        fontColor: `#ffffff`,
        padding: 100,
        fontSize: 25,
      },
    }
  }
};

