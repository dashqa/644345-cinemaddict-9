import DefaultComponent from './default-component';

class Filter extends DefaultComponent {
  constructor({title, count, link, isCountable, isActive, isAdditional}) {
    super();
    this._title = title;
    this._count = count;
    this._link = link;
    this._isCountable = isCountable;
    this._isActive = isActive;
    this._isAdditional = isAdditional;
  }

  getTemplate() {
    return `
       <a 
         href="#${this._link}" 
         class="main-navigation__item ${this._isActive ? `main-navigation__item--active` : ``}
         ${this._isAdditional ? `main-navigation__item--additional`: ``}">${this._title}
          ${!this._isCountable && this._count !== null ? `<span class="main-navigation__item-count">this._count</span>` : ``}
      </a>
    `.trim();
  };
}

export default Filter;
