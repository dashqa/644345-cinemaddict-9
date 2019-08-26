import DefaultComponent from './default-component';

class NavMenu extends DefaultComponent {
  getTemplate() {
    return `
      <nav class="main-navigation"></nav>
    `.trim();
  }
}

export default NavMenu;
