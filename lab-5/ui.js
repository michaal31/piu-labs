import { store } from './store.js';

const container = document.querySelector('#shapes');
const countSq = document.querySelector('#count-sq');
const countCi = document.querySelector('#count-ci');

function renderShape(shape) {
const div = document.createElement('div');
div.className = `shape ${shape.type}`;
div.style.background = shape.color;
div.dataset.id = shape.id;
return div;
}

store.subscribe(state => {

countSq.innerText = state.shapes.filter(s => s.type === 'square').length;
countCi.innerText = state.shapes.filter(s => s.type === 'circle').length;
});

export function initialRender() {
container.innerHTML = '';
store.state.shapes.forEach(shape => {
container.appendChild(renderShape(shape));
});
}

container.addEventListener('click', e => {
if (!e.target.classList.contains('shape')) return;
const id = Number(e.target.dataset.id);
store.removeShape(id);
e.target.remove(); 
});

store.subscribe(state => {
const existingIds = new Set([...container.children].map(c => Number(c.dataset.id)));
const stateIds = new Set(state.shapes.map(s => s.id));

state.shapes.forEach(s => {
if (!existingIds.has(s.id)) container.appendChild(renderShape(s));
});

[...container.children].forEach(el => {
const id = Number(el.dataset.id);
if (!stateIds.has(id)) el.remove();
});

state.shapes.forEach(s => {
const el = container.querySelector(`[data-id="${s.id}"]`);
if (el) el.style.background = s.color;
});
});