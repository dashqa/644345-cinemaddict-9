import DefaultComponent from './default-component';

class Filter extends DefaultComponent {
  constructor({title, count, id, isActive, isCountable, isAdditional}) {
    super();
    this._title = title;
    this._count = count;
    this._id = id;
    this._isActive = isActive;
    this._isAdditional = isAdditional;
    this._isCountable = isCountable;
  }

  getTemplate() {
    return `
       <a 
         href="#${this._id}" 
         class="main-navigation__item ${this._isActive ? `main-navigation__item--active` : ``} ${this._isAdditional ? `main-navigation__item--additional` : ``}">
          ${this._title}
          ${this._isCountable ? `<span class="main-navigation__item-count">${this._count}</span>` : ``}
      </a>
    `.trim();
  }
}

export default Filter;
