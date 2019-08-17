const getTitle = (rating) => {
  switch (true) {
    case rating >= 1 && rating <= 10:
      return `Novice`;
    case rating >= 11 && rating <= 20:
      return `Fan`;
    default: return `Movie Buff`;
  }
};

export const getProfileComponent = (rating) => {
  return `
    <section class="header__profile profile">
    ${rating ?
    `<p class="profile__rating">${getTitle(rating)}</p>` : ``}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
};
