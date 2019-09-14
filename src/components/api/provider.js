import ModelFilm from './model-film';
import {objectToArray} from '../../utils';

const Provider = class {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          films.map((film) => this._store.setItem({key: film.id, item: film.toRAW()}));
          return films;
        });
    } else {
      const rawFilms = objectToArray(this._store.getAll());
      const films = ModelFilm.parseFilms(rawFilms);

      return Promise.resolve(films);
    }
  }

  updateFilm({id, data}) {
    if (this._isOnline()) {
      return this._api.updateFilm({id, data})
        .then((film) => {
          this._store.setItem({key: film.id, item: film.toRAW()});
          return film;
        });
    } else {
      this._store.setItem({key: data.id, item: data});
      return Promise.resolve(ModelFilm.parseFilm(data));
    }
  }

  getComments({filmId}) {
    if (this._isOnline()) {
      return this._api.getComments({filmId})
        .then((comments) => {
          const rawFilms = objectToArray(this._store.getAll());
          const filmDataWithComments = Object.assign({}, rawFilms[filmId], {comments});

          this._store.setItem({key: filmId, item: filmDataWithComments});
          return comments;
        });
    }
  }

  createComment({comment, filmId}) {
    if (this._isOnline()) {
      return this._api.createComment({comment, filmId})
        .then((response) => {
          const {movie, comments} = response;
          const rawFilms = objectToArray(this._store.getAll());
          const filmDataWithComments = Object.assign({}, rawFilms[movie.id], {comments});

          this._store.setItem({key: filmId, item: filmDataWithComments});
          return comments;
        });
    }
  }

  deleteComment({commentId, filmId}) {
    if (this._isOnline()) {
      return this._api.deleteComment({commentId})
        .then(() => {
          const rawFilms = objectToArray(this._store.getAll());
          const index = rawFilms[filmId].comments.findIndex((comment) => comment.id === commentId);
          const commentsWithoutDeleted = rawFilms[filmId].comments.splice(rawFilms[filmId].comments[index],1);
          const filmDataWithComments = Object.assign({}, rawFilms[filmId], {comments: commentsWithoutDeleted});

          this._store.setItem({key: filmId, item: filmDataWithComments});
        });
    }
  }

  syncFilms() {
    return this._api.syncFilms({films: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
};

export default Provider;
