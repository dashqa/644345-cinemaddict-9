import PageController from './controllers/page';
import {PageElement} from './config';

const pageController = new PageController(PageElement.HEADER, PageElement.MAIN);
pageController.init();

