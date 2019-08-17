export const PIC_PATH = `/images/posters`;
export const MAX_DESCRIPTION_LENGTH = 139;
export const FILMS_QUANTITY = 17;
export const CARDS_PER_PAGE = 5;
export const FILM_SECTIONS = [
  {
    title: `All movies. Upcoming`,
    isExtra: false,
    isDisplay: true,
  },
  {
    title: `Top rated movies`,
    maxCardsQuantity: 2,
    isExtra: true,
    isDisplay: true,
  },
  {
    title: `Most commented`,
    maxCardsQuantity: 2,
    isExtra: true,
    isDisplay: true,
  }
];
