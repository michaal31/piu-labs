
function randomColor() {
    return `hsl(${Math.floor(Math.random()*360)}, 70%, 50%)`;
}

function save() {
    const data = {};
    document.querySelectorAll('.column').forEach(col => {
        const key = col.dataset.col;
        data[key] = [];
        col.querySelectorAll('.card').forEach(card => {
            data[key].push({
                id: card.dataset.id,
                text: card.querySelector('.card-text').innerText,
                color: card.style.background
            });
        });
    });
    localStorage.setItem('kanban', JSON.stringify(data));
}

function load() {
    const data = JSON.parse(localStorage.getItem('kanban'));
    if (!data) return;
    Object.keys(data).forEach(key => {
        const col = document.querySelector(`.column[data-col="${key}"] .cards`);
        data[key].forEach(item => createCard(col, item.text, item.id, item.color));
    });
    updateCounts();
}

let globalId = Date.now();


function createCard(container, text="Nowa karta", id=null, color=null) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = id || globalId++;
    card.style.background = color || randomColor();

    const txt = document.createElement('div');
    txt.className = 'card-text';
    txt.contentEditable = true;
    txt.innerText = text;
    txt.addEventListener('input', save);

    const controls = document.createElement('div');
    controls.className = 'card-controls';

    const del = document.createElement('button');
    del.innerText = 'x';
    del.addEventListener('click', () => {
        card.remove();
        updateCounts();
        save();
    });

    const left = document.createElement('button');
    left.innerText = '<-';

    const right = document.createElement('button');
    right.innerText = '->';

    const recolor = document.createElement('button');
    recolor.innerText = 'Kolor';
    recolor.addEventListener('click', () => {
        card.style.background = randomColor();
        save();
    });

    controls.append(del, left, right, recolor);
    card.append(txt, controls);
    container.appendChild(card);
    updateCounts();
    save();
}

document.querySelectorAll('.column').forEach(col => {
    col.addEventListener('click', e => {
        if (e.target.innerText !== '->' && e.target.innerText !== '<-') return;

        const card = e.target.closest('.card');
        const column = e.target.closest('.column');
        const order = ['todo', 'doing', 'done'];
        let idx = order.indexOf(column.dataset.col);

        if (e.target.innerText === '->' && idx < 2) idx++;
        if (e.target.innerText === '<-' && idx > 0) idx--;

        document.querySelector(`.column[data-col="${order[idx]}"] .cards`).appendChild(card);
        updateCounts();
        save();
    });
});


document.querySelectorAll('.add-card').forEach(btn => {
    btn.addEventListener('click', () => {
        const col = btn.closest('.column').querySelector('.cards');
        createCard(col);
    });
});


document.querySelectorAll('.color-column').forEach(btn => {
    btn.addEventListener('click', () => {
        const cards = btn.closest('.column').querySelectorAll('.card');
        cards.forEach(c => c.style.background = randomColor());
        save();
    });
});


document.querySelectorAll('.sort').forEach(btn => {
    btn.addEventListener('click', () => {
        const container = btn.closest('.column').querySelector('.cards');
        const cards = Array.from(container.children);
        cards.sort((a,b) => a.querySelector('.card-text').innerText.localeCompare(b.querySelector('.card-text').innerText));
        cards.forEach(c => container.appendChild(c));
        save();
    });
});


function updateCounts() {
    document.querySelectorAll('.column').forEach(col => {
        const cnt = col.querySelectorAll('.card').length;
        col.querySelector('.count').innerText = cnt;
    });
}

load();
