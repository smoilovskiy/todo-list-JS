//read todos from server
async function getData() {
  let response = await fetch('https://jsonplaceholder.typicode.com/todos',
    {
      method: 'GET',
      credentials: 'same-origin',
    })

  let serverAnswer = await response.json();
  return serverAnswer;
}

function addTodo() {
  const elemText = document.querySelector('.todo__text');
  const inputText = elemText.value;
  const completed = false;

  let id = 0;
  let title = '';

  //validation
  if (/^[0-9]+\.+\s/.test(inputText)) {
    id = inputText.split('. ')[0];
    title = inputText.split(/^[0-9]+\.+\s/)[1];
  } else return

  createTodo(id, title, completed);
}

function createTodo(id, title, completed) {
  let todoContent = id + '. ' + title;
  let todoItem = `<li class="todo__item ${completed ? "todo__completed" : ""}" data-todo-state="active">
      <a class="modal__window" href="#modal__window">
      <span class="todo__task" data-todo-action="todo-view">${todoContent}</span></a>
      <span class="todo__action todo__action_complete" data-todo-action="completed"></span>
      <span class="todo__action todo__action_delete" data-todo-action="deleted"></span></li>`;
  document.querySelector('.todo__items').insertAdjacentHTML('beforeend', todoItem);
}

function action(e) {
  const target = e.target;
  const action = target.dataset.todoAction;
  const elemItem = target.closest('.todo__item');

  //click on todo text -> transfer text to modal window 
  if (action === 'todo-view') {
    const todoText = target.closest('.todo__task');
    const text = todoText.innerHTML;
    window.content = text;
    document.querySelector('.modal__window-text').innerHTML = content;
  }


  if (target.classList.contains('todo__action')) {
    if (action === 'completed') {
      setCompleted(elemItem);
    }
    if (action === 'deleted') {
      elemItem.remove();
    }
    save();
  } else if (target.classList.contains('todo__add')) {
    addTodo();
    save();
  }
}

function setCompleted(elemItem) {
  elemItem.classList.contains('todo__completed') ? elemItem.classList.remove('todo__completed') :
    elemItem.classList.add('todo__completed');
}

function init() {

  if (!localStorage.length) {
    getData()
      .then(function (serverAnswer) {
        serverAnswer.forEach(todo => {
          createTodo(todo.id, todo.title, todo.completed)
        });
      });
  }
  const fromStorage = localStorage.getItem('todo');

  if (fromStorage) {
    document.querySelector('.todo__items').innerHTML = fromStorage;
  }
  document.addEventListener('click', action.bind());
}

function save() {
  localStorage.setItem('todo', document.querySelector('.todo__items').innerHTML);
}

//localStorage.clear();

init();
