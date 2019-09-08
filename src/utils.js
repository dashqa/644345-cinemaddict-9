import {Position} from './config';

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

export const getSortingValue = (item, sortBy) => {
  return sortBy === `rating`? item.rating : item.comments.length;
};

export const findCounts = (array) => {
  const counts = array.reduce((accum, current) => {
    accum[current] = (accum[current] || 0) + 1;
    return accum;
  },{});

  // сортируем в порядке убывания значения ключа
  return Object.keys(counts)
    .sort((a,b) => counts[b] - counts[a])
    .reduce((obj, key) => ({...obj, [key]: counts[key]}), {});
};

export const mostFrequents = (array) => {
  const counts = findCounts(array);
  const maxCount = Math.max(...Object.values(counts));

  return Object.keys(counts).filter(k => counts[k] === maxCount)
};

export const findMostFilm = (array, findBy) => {
  const sorted = array.sort((a, b) => getSortingValue(b, findBy) - getSortingValue(a, findBy));
  const first = getSortingValue(sorted[0], findBy);
  const last = getSortingValue(sorted[sorted.length - 1],findBy);

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

export const truncateString = (string, length) => string.length > length ? string.substring(0, length) + '...' : string;

export const getRandomItem = (targetArray = []) =>
  targetArray[Math.floor(Math.random() * Math.floor(targetArray.length - 1))];

export const getRandomArray = (targetArray = [], size = 1) => {
  const randomList = new Set();
  while (randomList.size <= size - 1) {
    const item = getRandomItem(targetArray);
    randomList.add(item);
  }
  return [...randomList];
};

