let comments = [];

const commName = document.querySelector('#comment-name');
const commText = document.querySelector('#comment-text');
const commentDate = document.querySelector('#comment-date');
const btn = document.querySelector('#comment-add');
const commentPlace = document.querySelector('.commet-place');

loadComments();

//Добавить комментарий
btn.addEventListener('click', () => {
    comments = compact(comments);
    if (commName.value === '') {
        commName.classList.add('red-border');
    } else if (commText.value === '') {
        commText.classList.add('red-border');
    } else {
        commName.classList.remove('red-border');
        commText.classList.remove('red-border')
        let comment = {
            name: commName.value,
            text: commText.value,
            date: `${commentDate.value}, ${getDate().slice(12)}`,
            like: false,
        };
        if (commentDate.value === '') {
            comment.date = getDate();
        }
        commName.value = '';
        commText.value = '';
        commentDate.value = '';
        comments.push(comment);

        saveComments();
        showComments();
    }
})

// Удаление пустых элементов из массива
function compact(coll) {
    const result = [];
    for (const item of coll) {
        if (item !== null && item !== undefined) {
            result.push(item);
        }
    }
    return result;
};

//Макс дата для инпута с датой
commentDate.max = getDate().slice(0, 10);

// Добавления нуля, если меньше 10;
function changNumLessTen(num) {
    if (num < 10) {
        return num = `0${num}`;
    } else {
        return num;
    }
}
// Дата
function getDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let min = date.getMinutes();

    day = changNumLessTen(day);
    month = changNumLessTen(month);
    hour = changNumLessTen(hour);
    min = changNumLessTen(min);

    return `${year}-${month}-${day}, ${hour}:${min}`
}
// Построение комменатриев
function showComments() {
    comments = compact(comments);
    const parts = [];
    let id = 0;
    for (item of comments) {
        parts.push(`
<li class="comment-item" data-id="${id}">
    <div class="comment-header">
        <span class="name">${item.name}</span>
        <span class="date">${checkDate(transformDate(item.date))}</span>
    </div>
    <div class="comment-main">${item.text}</div>
    <div class="comment-footer">
        <button type="button" class="delete" data-id="${id}">Удалить</button>
        <a type="button" class="like" data-like="${item.like}"><span class="material-symbols-outlined">favorite</span></a>
    </div>        
</li>`);
        id++;
    }
    const result = parts.join('');
    const out = `<ul class="comment-items"> ${result} </ul>`;
    commentPlace.innerHTML = out;
}
// Удаление комментария 
commentPlace.addEventListener('click', (e) => {
    if (e.target.matches('.delete')) {
        const { id } = e.target.dataset;
        delete comments[id];
        commentPlace.querySelector('.comment-item').remove();
        comments = compact(comments);
        saveComments();
    }
})

//Лайк 
const like = document.querySelectorAll('.like');
like.forEach(item => {
    item.addEventListener('click', (e) => {
        let id = item.closest('.comment-item').getAttribute('data-id');
        if (comments[id].like === false) {
            item.setAttribute('data-like', 'true')
            comments[id].like = true;
            saveComments();
        } else {
            item.setAttribute('data-like', 'false')
            comments[id].like = false
            saveComments();
        }

    });
});


// Сохранения комментариев
function saveComments() {
    localStorage.setItem('comments', JSON.stringify(comments));
}
function loadComments() {
    comments = compact(comments);
    if (localStorage.getItem('comments')) comments = JSON.parse(localStorage.getItem('comments'));
    showComments();
}
// Проверка даты
function checkDate(item) {
    let today = new Date();
    let yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1);

    today = `${changNumLessTen(today.getDate())}.${changNumLessTen(today.getMonth() + 1)}.${today.getFullYear()}`;
    yesterday = `${changNumLessTen(yesterday.getDate())}.${changNumLessTen(yesterday.getMonth() + 1)}.${yesterday.getFullYear()}`;

    let newItem = item.slice(0, 10);
    if (newItem === today) {
        return `сегодня, ${item.slice(12)}`
    } else if (newItem === yesterday) {
        return `вчера, ${item.slice(12)}`
    } else {
        return item;
    }
}

// Трансфомрация даты 
function transformDate(item) {
    return `${item.slice(8, 10)}.${item.slice(5, 7)}.${item.slice(0, 4)}, ${item.slice(12)}`
}