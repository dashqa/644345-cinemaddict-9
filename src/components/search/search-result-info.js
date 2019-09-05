import DefaultComponent from '../default-component';

class SearchResultInfo extends DefaultComponent {
  constructor({counter}) {
    super();
    this._counter = counter || 0;
  }
  getTemplate() {
    return `<div class="result">
      <p class="result__text">Result <span class="result__count">${this._counter}</span></p></div>`.trim();
  }
}

export default SearchResultInfo;
