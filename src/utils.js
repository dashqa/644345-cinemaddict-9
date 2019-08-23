import {Position} from './config';

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
export const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
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

export const getSortingValue = (item, sortBy) => {
  return sortBy === `rating`? item.rating : item.comments.length;
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

