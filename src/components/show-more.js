import DefaultComponent from './default-component';

class ShowMore extends DefaultComponent {
  getTemplate() {
    return `
      <button class="films-list__show-more">Show more</button>
  `.trim();
  }
}

export default ShowMore;
