import ModelFilm from './model-film';
import {objectToArray} from '../../utils';

const Provider = class {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
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

  createFilm({film}) {
    if (this._isOnline()) {
      return this._api.createFilm({film})
        .then((film) => {
          this._store.setItem({key: film.id, item: film.toRAW()});
          return film;
        });
    } else {
      film.id = this._generateId();

      this._store.setItem({key: film.id, item: film});
      return Promise.resolve(ModelFilm.parseFilm(film));
    }
  }

  deleteFilm({id}) {
    if (this._isOnline()) {
      return this._api.deleteFilm({id})
        .then(() => {
          this._store.removeItem({key: id});
        });
    } else {
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          films.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
          return films;
        });
    } else {
      const rawFilmsMap = this._store.getAll();
      const rawFilms = objectToArray(rawFilmsMap);
      const films = ModelFilm.parseFilms(rawFilms);

      return Promise.resolve(films);
    }
  }

  syncTasks() {
    return this._api.syncTasks({films: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
};

export default Provider;
