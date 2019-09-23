import {Position} from './config';
import moment from 'moment';
import DOMPurify from 'dompurify';


export const sanitizeInput = (input) => {
  const config = {ALLOWED_TAGS: ['#text'], KEEP_CONTENT: true};
  return DOMPurify.sanitize(input, config);
};

export const getSortedFilmsArray = (films, sortType) => {
  switch (sortType) {
    case `date`:
      return films.slice().sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    case `rating`:
      return films.slice().sort((a, b) => b.rating - a.rating);
    case `default`:
      return films;
  }
  return null;
};

export const getFilteredFilmsArray = (films, filterType) => {
  switch (filterType) {
    case `stats`:
      return null;
    case `watchlist`:
      return films.filter((film) => film.inWatchlist);
    case `history`:
      return films.filter((film) => film.isWatched);
    case `favorites`:
      return films.filter((film) => film.isFavorite);
    case `all`:
      return films;
  }
  return null;
};

export const getWatchedFilmsByPeriod = (watchedFilms, period) => {
  switch (period) {
    case `all-time`:
      return watchedFilms;
    case `today`:
      return watchedFilms.filter((film) => moment().isSame(moment(film.watchedDate), `day`));
    case `week`:
      return watchedFilms.filter((film) => moment(film.watchedDate) > moment().subtract(1, `w`));
    case `month`:
      return watchedFilms.filter((film) => moment(film.watchedDate) > moment().subtract(1, `months`));
    case `year`:
      return watchedFilms.filter((film) => moment(film.watchedDate) > moment().subtract(1, `y`));
  }
  return null;
};

export const findCounts = (array) => {
  const counts = array.reduce((accum, current) => {
    accum[current] = (accum[current] || 0) + 1;
    return accum;
  }, {});

  // сортируем в порядке убывания значения ключа
  return Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .reduce((obj, key) => (Object.assign({}, obj, {[key]: counts[key]})), {});
};

export const mostFrequents = (array) => {
  const counts = findCounts(array);
  const maxCount = Math.max(...Object.values(counts));

  return Object.keys(counts).filter((k) => counts[k] === maxCount);
};

export const getSortingValue = (item, sortBy) => sortBy === `rating` ? item.rating : item.comments.length;

export const findMostFilm = (array, findBy) => {
  const sorted = array.sort((a, b) => getSortingValue(b, findBy) - getSortingValue(a, findBy));
  const first = getSortingValue(sorted[0], findBy);
  const last = getSortingValue(sorted[sorted.length - 1], findBy);

  if (first && last !== 0) {
    return first === last ? getRandomArray(sorted, 2) : sorted.slice(0, 2);
  }
  return null;
};

export const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;
  return element.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const truncateString = (string, length) => string.length > length ? string.substring(0, length) + `...` : string;

export const objectToArray = (object) => Object.keys(object).map((id) => object[id]);

export const getRandomItem = (targetArray = []) =>
  targetArray[Math.floor(Math.random() * Math.floor(targetArray.length))];

export const getRandomArray = (targetArray = [], size = 1) => {
  const randomList = new Set();
  for (let i = 0; i <= size; i++) {
    const item = getRandomItem(targetArray);
    randomList.add(item);
  }
  return [...randomList];
};

export const debounce = (callback, time = 400, interval) =>
  (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      callback(...args);
    }, time);
  };

