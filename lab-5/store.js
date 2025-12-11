import { randomColor } from './helpers.js';

class Store {
constructor() {
const saved = JSON.parse(localStorage.getItem('shapes-app'));
this.state = saved || { shapes: [] };
this.subscribers = [];
}

subscribe(fn) {
this.subscribers.push(fn);
}

notify() {
localStorage.setItem('shapes-app', JSON.stringify(this.state));
this.subscribers.forEach(fn => fn(this.state));
}

addShape(type) {
this.state.shapes.push({
id: Date.now() + Math.random(),
type,
color: randomColor()
});
this.notify();
}

removeShape(id) {
this.state.shapes = this.state.shapes.filter(s => s.id !== id);
this.notify();
}

recolor(type) {
this.state.shapes = this.state.shapes.map(s =>
s.type === type ? { ...s, color: randomColor() } : s
);
this.notify();
}
}


export const store = new Store();