const ratings = [{
  title: `Novice`,
  minRating: 1,
}, {
  title: `Fan`,
  minRating: 10,
}, {
  title: `Movie Buff`,
  minRating: 21,
}];


export const getProfileMarkup = (rating) => {
  return `
    <section class="header__profile profile">
    ${rating ?
    `<p class="profile__rating">${ratings.filter((item) => item.minRating <= rating).pop().title}</p>` : ``}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
};
