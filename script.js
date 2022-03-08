var d = document;
// iphone time on topbar =================================
var startTime = function() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  m = checkTime(m);
  d.getElementById('c-time__hour').innerHTML = h;
  d.getElementById('c-time__minutes').innerHTML = m;
  setTimeout(startTime, 500);
  
  function checkTime(i) {
    if (i < 10) {
      i = "0" + i
    };
    return i;
  }
}
// calendar on header ====================================
var calendar = function() {
  var date = new Date();
  var weekday = new Array(7);
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  weekday[0] =  "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  d.querySelector('.c-data__day').innerHTML = weekday[date.getDay()];
  d.querySelector('.c-data__date').innerHTML = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();

}
// todo list =============================================
var todoList = function() {
  var d = document;
  var checkShowCompleted = false;
  // local storage
  var hasLocalStorage = function() {
    return 'localStorage' in window;
  }
  if (hasLocalStorage()) {
    checkShowCompleted = localStorage.getItem('checkShowCompleted');
  }
  //start todo list array
  var todos = [
    {
      name: 'Write your first todo',
      completed: false,
    },
    {
      name: 'Restart the browser',
      completed: false,
    },
    {
      name: 'Go back here!',
      completed: false,
    },
    {
      name: 'Open computer',
      completed: true,
    }
  ];
  
  //function to create element list
  var createLi = function(obj, id) {
    var id = id || 0;
    var li = d.createElement('li');
    var spanDone = d.createElement('span');
    var spanText = d.createElement('span');
    var spanDelete = d.createElement('span');
    li.id = id;
    spanDone.className = 'js-done';
    spanText.className = 'js-text';
    spanDelete.className = 'js-delete';
    spanText.appendChild(d.createTextNode(obj.name));
    li.appendChild(spanDone);
    li.appendChild(spanText);
    li.appendChild(spanDelete);
    if (obj.completed) {
      li.classList.add('isChecked');
      if (checkShowCompleted === 'false' || checkShowCompleted == null) {
        li.classList.add('isHidden');
      }
    }   
    return li;
  }
  //function to order list
  var orderList = function(toDoList) {
    var list = toDoList.getElementsByTagName('li');
    for (i = 0; list[i]; i++) {
      list[i].id = i;
    }
  }
  //toggle complete single todo element
  var toggleComplete = function(id) {
    todos[id].completed = !todos[id].completed;
  }
  //sync with local sotrage
  var syncLocalStorage = function() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  // return methods ==============================================
  return {
    //method to read list
    getTodos: function() {
      
      if (hasLocalStorage() && localStorage.getItem('todos')) {
        todos = JSON.parse(localStorage.getItem('todos'))
        return todos;
      } else if (todos.length > 0) {
        return todos;    
      } else {
        return false;
      }
    },
    //method to push element list
    addTodo: function(todo) {
      todos.unshift({name: todo, completed: false});
      syncLocalStorage();
    },
    //method to create list
    createLi: createLi,
    //method to order list
    orderList: orderList,
    //method to complete single todo
    toggleComplete: function(id) {
      toggleComplete(id);
      syncLocalStorage();
    },
    //check if todo is completed
    toggleViewCompleted: function() {
      if (checkShowCompleted == 'false') {
         checkShowCompleted = true;
      } else {
         checkShowCompleted = false;
      }
      if (hasLocalStorage()) {
        localStorage.setItem('checkShowCompleted', checkShowCompleted);
      }
    },
    //check completed view
    getShowCompleted: function() {
      if (checkShowCompleted == 'true') {
        return true
      } else {
        return false
      }
    },
    //method to remove todo
    removeTodo: function(id) {
      todos.splice(id,1);
      syncLocalStorage();
    }
  }
    
}

//on document load ================================================
d.addEventListener('DOMContentLoaded', function() {
  var myApp = todoList(); //call main function
  var appTodos = d.querySelector('#c-app__todo'); //container ToDo List
  var listTodo = myApp.getTodos(); //call todo list
  var showCompletedBtn = d.querySelector('#js-listComplete');
  var checkShowCompleted = myApp.getShowCompleted();
  showCompletedBtn.innerHTML = checkShowCompleted ? 'Ocultar concluído' : 'Mostrar concluído';
  if (myApp.getTodos()) {
    listTodo.forEach(function(todo, id) { //list mapping 
      appTodos.appendChild(myApp.createLi(todo, id)); //create li + append to container
    });
  }
  
  //button show/hide completed
  showCompletedBtn.addEventListener('click', function(e) {
      var checkedElements = appTodos.getElementsByClassName('isChecked');
      checkShowCompleted = !checkShowCompleted;
      myApp.toggleViewCompleted();
      e.target.innerHTML = checkShowCompleted ? 'Ocultar concluído' : 'Ocultar concluído';
      for (var i = 0; checkedElements[i]; i++) {
        checkedElements[i].classList.toggle('isHidden');
      }
  });
  
  //single todo
  appTodos.addEventListener('click', function(e){
    var el = e.target.parentNode;
    //done button
    if (e.target.className === 'js-done') {
      myApp.toggleComplete(el.id);
      el.classList.toggle('isChecked');
      if (!checkShowCompleted) {
        el.classList.add('isHidden');
      }
    }
    //delete button
    if (e.target.className === 'js-delete') {
      el.parentNode.removeChild(el);
      myApp.removeTodo(el.id);
    }
  });
  
  //add single todo
  var todoInput = d.querySelector('#todo'); //input
  var addTodo = d.querySelector('#js-add'); //add button
  addTodo.addEventListener('click', function(e) { //event click on keyboard
    if (todoInput.value && todoInput.value.length >= 3) {
      var todo = todoInput.value; //get input value
      myApp.addTodo(todo); //cal method add todo
      todoInput.value = ''; //reset input
      var li = myApp.createLi({name: todo, completed: false}); //var with create li metohd
      appTodos.insertBefore(li, appTodos.firstElementChild); //add todo always on top after input
      li.classList.add('fadeIn');
      setTimeout(function(){
       li.classList.remove('fadeIn'); 
      }, 600);
      myApp.orderList(appTodos);
    }
  });
   
  startTime();
  calendar();
});