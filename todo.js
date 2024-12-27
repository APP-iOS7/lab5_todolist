// DOM 요소들을 미리 저장
const todoListElement = document.getElementById('todoList');
const addButton = document.getElementById('addTodo');
const todoInput = document.getElementById('todoInput');

function addTodo(text, checked = false) {
  // li 요소 만들기
  const li = document.createElement('li');
  li.classList.add(
    'list-group-item',
    'd-flex',
    'align-items-center',
    'justify-content-between'
  );

  // 체크박스 만들기
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('form-check-input');
  // checkbox 요소 checked 프로퍼티에 checked 파라미터의 값 (true/false) 할당
  checkbox.checked = checked;

  // 텍스트 추가
  const spanElement = document.createElement('span');
  spanElement.classList.add('ms-2', 'flex-grow-1');
  spanElement.textContent = text;

  // 체크박스 상태에 따라 취소선 처리
  spanElement.style.textDecoration = checked ? 'line-through' : 'none';

  // 체크박스 클릭시 처리
  // 체크박스의 값이 변경되면, 여기서 정의한 함수가 실행됨 (지연 실행)
  checkbox.addEventListener('change', () => {
    spanElement.style.textDecoration = checkbox.checked
      ? 'line-through'
      : 'none';

    // localStorage 업데이트
    const todos = loadTodos();
    const index = Array.from(li.parentElement.children).indexOf(li);
    todos[index].checked = checkbox.checked;
    saveTodos(todos);
  });

  // 수정 기능 연결
  spanElement.addEventListener('dblclick', () => {
    editTodo(li, spanElement);
  });

  // 삭제 버튼 추가
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-1');
  deleteButton.textContent = '삭제';
  deleteButton.addEventListener('click', () => {
    // localStorage 업데이트
    const todos = loadTodos();
    const index = Array.from(li.parentElement.children).indexOf(li);
    todos.splice(index, 1);
    saveTodos(todos);
    // 요소 삭제
    li.remove();
  });

  li.prepend(checkbox);
  li.append(spanElement);
  li.append(deleteButton);
  todoListElement.append(li);
}

// localStorage에서 할일 목록 가져오기
function loadTodos() {
  const savedTodos = localStorage.getItem('todoList');
  return savedTodos ? JSON.parse(savedTodos) : [];
}

// localStorage에 할일 목록 저장하기
function saveTodos(todos) {
  localStorage.setItem('todoList', JSON.stringify(todos));
}

// 수정 함수
function editTodo(li, spanElement){
  // 기존 텍스트를 저장 (수정을 취소하거나 참조할 때 사용)
  const originalText = spanElement.textContent;

  // 더블 클릭 시 input 필드 생성
  const inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.value = originalText; // 기존 텍스트를 입력 필드에 설정
  inputElement.classList.add('form-control', 'ms-2', 'flex-grow-2');
  inputElement.style.width = '85%';

  // 입력 필드로 기존 텍스트 요소(span)를 교체
  li.replaceChild(inputElement, spanElement); // li 요소의 자식을 input으로 교체
  inputElement.focus(); // 입력 필드에 포커스를 설정하여 바로 수정 가능

  // 수정 저장 함수 (입력값 저장 및 화면 반영)
  const saveEdit = () => {
    const newValue = inputElement.value.trim();
    if (newValue === '') {
      alert('내용을 입력하세요!');
      return;
    }

    // LocalStorage에서 기존 할 일 데이터를 가져오기
    const todos = loadTodos();
    const index = Array.from(li.parentElement.children).indexOf(li); 
    todos[index].text = newValue;
    saveTodos(todos); // 업데이트된 할 일 목록을 LocalStorage에 저장

    // 입력 필드를 텍스트(span) 요소로 복구
    spanElement.textContent = newValue;
    li.replaceChild(spanElement, inputElement);
  };

  // 입력 필드에서 포커스가 벗어날 때 수정 저장
  inputElement.addEventListener('blur', saveEdit);

  // 입력 필드에서 Enter 키를 눌렀을 때 수정 저장
  inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      saveEdit(); // Enter 키 입력 시 saveEdit 호출
    }
  });

}

// 초기화 함수
function initialize() {
  // 저장된 할일 목록 불러오기
  const todos = loadTodos();
  todos.forEach((todo) => {
    addTodo(todo.text, todo.checked);
  });

  // 새로운 할일 추가 버튼 클릭 이벤트
  addButton.addEventListener('click', () => {
    if (todoInput.value.trim() === '') return; // 빈 입력 방지

    // 새로운 할일 추가
    addTodo(todoInput.value);

    // localStorage 업데이트
    const todos = loadTodos();
    const todoData = {
      text: todoInput.value,
      checked: false,
    };
    todos.push(todoData);
    saveTodos(todos);

    // 입력창 비우기
    todoInput.value = '';
  });
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', initialize);
