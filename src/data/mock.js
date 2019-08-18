import {getRandomInt, getRandomFloat, getRandomArray, getRandomItem} from './../utils';

const TITLES = [`Fast & Furious Presents: Hobbs & Shaw`, `Scary Stories to Tell in the Dark`, `The Lion King`,
  `Dora and the Lost City of Gold`, `Once Upon a Time ... in Hollywood`, `The Art of Racing in the Rain`,
  `Spider-Man: Far from Home`, `Toy Story 4`, `Bring The Soul: The Movie`, `Avengers: Endgame`, `It`,
  `Star Wars: The Force Awakens`, `Jurassic World`, `Catching Fire`, `Transformers 3`, `Deadpool`, `Avatar`];

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta 
ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. 
Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae,
sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. 
Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. 
In rutrum ac purus sit amet tempus.`;

const GENRES = [`Adventure`, `Comedy`, `Drama`, `Documentary`, `Thriller`, `Musical`, `Horror`, `Family`, `Action`];
const PICTURES = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const MAX_RATING = 10;

const generateFilmData = () => ({
  get title() {
    return getRandomItem(TITLES);
  },
  get rating() {
    return getRandomFloat(0, MAX_RATING).toFixed(1);
  },
  get year() {
    return getRandomInt(1900, 2019);
  },
  get genres() {
    const tempSet = new Set();
    const genreQuantity = getRandomInt(1, 2);
    for (let i = 0; i < genreQuantity; i++) {
      tempSet.add(GENRES[getRandomInt(0, GENRES.length - 1)]);
    }
    return tempSet;
  },
  get picture() {
    return getRandomItem(PICTURES);
  },
  get description() {
    const sentences = DESCRIPTION.split(`.`);
    return getRandomArray(sentences, getRandomInt(1, 3)).join(`.`);
  },
  comments: [{
    text: `Это комментарий`,
    author: `Неопознанная мышь`,
    date: Date.now(),
    reaction: 5,
  }, {
    text: `Это комментарий 2`,
    author: `Неопознанный енот`,
    date: Date.now(),
    reaction: 2,
  }],
  duration: `1h 55m`
});

export const getMock = (quantity) => {
  return [...Array(quantity)].map(generateFilmData);
};


