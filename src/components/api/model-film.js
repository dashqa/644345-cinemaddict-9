import moment from 'moment';

class ModelFilm {
  constructor(filmData) {
    this.id = filmData[`id`] || null;
    this.picture = `./${filmData[`film_info`][`poster`]}` || ``;
    this.title = filmData[`film_info`][`title`] || ``;
    this.originalTitle = filmData[`film_info`][`alternative_title`] || ``;
    this.description = filmData[`film_info`][`description`] || ``;
    this.duration = filmData[`film_info`][`runtime`] || null;
    this.rating = filmData[`film_info`][`total_rating`] || 0;
    this.releaseDate = filmData[`film_info`][`release`][`date`] || null;
    this.country = filmData[`film_info`][`release`][`release_country`] || ``;
    this.genre = new Set(filmData[`film_info`][`genre`] || []);
    this.minAge = filmData[`film_info`][`age_rating`] || 0;
    this.actors = filmData[`film_info`][`actors`] || [];
    this.director = filmData[`film_info`][`director`] || ``;
    this.writers = filmData[`film_info`][`writers`] || [];
    this.comments = filmData[`comments`];
    this.inWatchlist = Boolean(filmData[`user_details`][`watchlist`]) || false;
    this.isWatched = Boolean(filmData[`user_details`][`already_watched`]) || false;
    this.isFavorite = Boolean(filmData[`user_details`][`favorite`]) || false;
    this.userRating = filmData[`user_details`][`personal_rating`] || ``;
    this.watchedDate = moment(filmData[`user_details`][`watching_date`]).format() || null;
  }

  static parseFilm(filmData) {
    return new ModelFilm(filmData);
  }

  static parseFilms(filmData) {
    return filmData.map(ModelFilm.parseFilm);
  }

  toRAW() {
    return {
      'film_info': {
        'poster': this.picture,
        'title': this.title,
        'alternative_title': this.originalTitle,
        'description': this.description,
        'runtime': this.duration,
        'total_rating': parseInt(this.rating, 10),
        'release': {
          'date': new Date(this.releaseDate),
          'release_country': this.country,
        },
        'genre': [...this.genre.values()],
        'age_rating': this.minAge,
        'actors': this.actors,
        'director': this.director,
        'writers': this.writers,
      },
      'user_details': {
        'already_watched': this.isWatched,
        'favorite': this.isFavorite,
        'watchlist': this.inWatchlist,
        'personal_rating': parseInt(this.userRating, 10) || 0,
        'watching_date': new Date(this.watchedDate) || null,
      },
      'comments': this.comments,
    };
  }
}

export default ModelFilm;
