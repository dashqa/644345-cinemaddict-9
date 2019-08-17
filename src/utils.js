export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
export const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

export const getRandomArray = (targetArray = [], size = 1) => {
  const getRandomItem = ({ targetArray = [] }) =>
    targetArray[Math.floor(Math.random() * Math.floor(targetArray.length - 1))];

  const randomList = [];
  while (randomList.length <= size - 1) {
    const item = getRandomItem({ targetArray });
    if (!randomList.includes(item)) {
      randomList.push(item);
    }
  }
  return randomList;
};

export const trimString = (string, length) => string.length > length ? string.substring(0, length) + '...' : string;

