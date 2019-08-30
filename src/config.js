export const PIC_PATH = `./images/posters`;
export const MAX_DESCRIPTION_LENGTH = 139;
export const FILMS_QUANTITY = 14;
export const CARDS_PER_PAGE = 5;

export const STATISTICS_FILTERS = [
  {title: `All time`, value: `all-time`, isChecked: true},
  {title: `Today`, value: `today`, isChecked: false},
  {title: `Week`, value: `week`, isChecked: false},
  {title: `Month`, value: `month`, isChecked: false},
  {title: `Year`, value: `year`, isChecked: false},
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

export const FILM_DETAILS_CONTROLS = [
  {title: `Add to watchlist`, value: `watchlist`},
  {title: `Already watched`, value: `watched`},
  {title: `Add to favorites`, value: `favorite`}
];

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const PageElement = {
  BODY: document.querySelector(`body`),
  MAIN: document.querySelector(`.main`),
  HEADER: document.querySelector(`.header`),
  // NAV: document.querySelector(`.main-navigation`),
  // BOARD: document.querySelector(`.films`),
  // MAIN_FILMS: document.querySelectorAll(`.films-list__container`)[0],
  // TOP_RATED_FILMS: document.querySelectorAll(`.films-list__container`)[1],
  // MOST_COMMENTED_FILMS: document.querySelectorAll(`.films-list__container`)[2],
  SHOW_MORE: document.querySelector(`.films-list__show-more`),
  FOOTER_STATISTICS: document.querySelector(`.footer`),
};

