import { store } from './store.js';
import { initialRender } from './ui.js';


document.querySelector('#add-square').addEventListener('click', () => store.addShape('square'));
document.querySelector('#add-circle').addEventListener('click', () => store.addShape('circle'));


document.querySelector('#recolor-squares').addEventListener('click', () => store.recolor('square'));
document.querySelector('#recolor-circles').addEventListener('click', () => store.recolor('circle'));


initialRender();