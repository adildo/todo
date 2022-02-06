// import { format, compareAsc } from 'date-fns'
const projects = document.getElementById('projects');
const todayDate = document.getElementById('todayDate')
const openedProject = document.getElementById('openedProject');
const projectForm = document.getElementById('projectForm')
const newProjectInput = document.getElementById('newTaskInput')
const todoManagement = document.getElementById('todos')
const todoName = document.getElementById('todo-management')
const closeTodoModal = document.getElementById('close-todo-modal')
const overlay = document.getElementById('overlay')
const modal = document.getElementById('todoModal')
const todoForm = document.getElementById('todoForm')
const newTaskName = document.querySelector('#taskName')
const newTaskDate = document.querySelector('#dueDate')
const newTaskInfo = document.querySelector('#info')
const selectPriority = document.querySelector('#priority');

let currentProject 
let currentTask
let myStorage = JSON.parse(localStorage.getItem('storage'));
let projectList = myStorage || [];
let editTask = false

closeTodoModal.addEventListener('click', () => {
    closeModal(modal)
})

todayDate.innerText = 'Today\'s Date: ' + new Date().toString().slice(0,15)

const createAddTodoBtn = () => {
    const newTodoBtn = document.createElement('button');
    newTodoBtn.innerText = "+ Add new item";
    newTodoBtn.id = 'newTodoBtn'
    newTodoBtn.addEventListener('click', () => {
        openModal(modal)
    })
    todoManagement.append(newTodoBtn)
}

const renderTask = function(parent, taskName, date, priority, description, project) {
    const container = document.createElement('div');
    container.classList = "container";
    const infoCont = document.createElement('div');
    infoCont.classList = 'infoCont'
    infoCont.addEventListener('click', () => {
        alert(description)
    })
    
    const settings = document.createElement('div');
    settings.classList = 'settings'
    const todoName = document.createElement('div');
    todoName.classList = 'todo Name';
    todoName.innerText = taskName;
    const dueDate = document.createElement('h4');
    dueDate.classList = 'todo dueDate';
    dueDate.innerText = date;
    const taskPriority = document.createElement('h4');
    taskPriority.classList = 'todo priority';
    taskPriority.innerText = priority;
    infoCont.append(dueDate, taskPriority, todoName);

    const edit = document.createElement('button');
    edit.innerText = 'Edit';
    edit.addEventListener('click', () => {
        editTaskModal(modal, taskName, date, description, priority)
    })
    settings.appendChild(edit)
    createDeleteBtn(settings, container, taskName, project.toDos);
    container.append(infoCont, settings)
    parent.append(container);
}
const editTaskModal = (modal, taskName, date, description, priority) => {
    openModal(modal)
            editTask = true
            currentTask = taskName
            newTaskName.value = taskName
            newTaskDate.value = date
            newTaskInfo.value = description
            selectPriority.value = priority
    }
const openProj = (projName, projectList, item) => {
    currentProject = projName;
    openedProject.innerText = projName;
    clearDOM(todoManagement)
    const clickedProj = findObjInList(projectList, currentProject)
    clickedProj.toDos.forEach(task => renderTask(todoManagement, task.name, task.dueDate, task.priority, task.description, clickedProj))
    createAddTodoBtn()
}
const openModal = (modal) => {
    if (modal === null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

const closeModal = (modal) => {
    if (modal === null) return
    todoForm.reset();
    modal.classList.remove('active')
    overlay.classList.remove('active')
}

const Project = function(name) { 
    const toDos = []
    const addTodo = (todoTask) => {
        toDos.push(todoTask)
    }
    const removeTodo = function(todoName) {
        const ObjIndex = toDos.findIndex(obj => obj.name === todoName);
        if (ObjIndex < 0) console.log("Problem - this is project does not exist in todo list");
        toDos.splice(ObjIndex, 1)
    }    
    return {name, addTodo, removeTodo, toDos}
}

const addToList = (list, item) => {
    const ObjIndex = list.findIndex(obj => obj.name === item.name);
        if (ObjIndex > -1) return console.log("Problem - this is task name already exist. please try again");
    list.push(item)
}
const removeFromList = (list, item) => {
    const ObjIndex = list.findIndex(obj => obj.name === item);
    if (ObjIndex < 0) return console.log("Problem - this is project does not exist in list");
    list.splice(ObjIndex, 1)
}
const clearDOM = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}
const createDeleteBtn = function(parent, nodeItemToRemove, name, listToRemoveFrom) {
    const deleteBtn = document.createElement('button');
    deleteBtn.classList = 'setting del'
    deleteBtn.innerText = "Del"
    deleteBtn.addEventListener('click', () => {
        removeFromList(listToRemoveFrom ,name)
        nodeItemToRemove.remove()
        if (currentProject === name) {
            while (todoManagement.firstChild) {
                todoManagement.removeChild(todoManagement.firstChild)
            }
            openedProject.innerText = "Click on project to see task"
        }
    })
    parent.append(deleteBtn);
}
const createProjectDOM = (parent, projectName) => {
    const container = document.createElement('div');
    container.classList = "container";
    const settings = document.createElement('div');
    settings.classList = 'settings'
    const itemName = document.createElement('div');
    itemName.classList = 'itemName';
    itemName.innerText = projectName;
    itemName.addEventListener('click', () => {
        openProj(projectName, projectList)
    })
    newProjectInput.value = "";
    createDeleteBtn(settings, container, projectName, projectList);
    container.append(itemName, settings)
    parent.append(container);
}
const createNewProject = (projN) => {
    if (projectList.some(proj => proj.name === projN)) {
        console.log('this project name already exists. Please choose new name')
        return 
    }
    const newProj = Project(projN)
    projectList.push(newProj)
    localStorage.setItem('storage', JSON.stringify(projectList))
    clearDOM(projects)
    projectList.forEach(project => createProjectDOM(projects, project.name))
}
const submitNewProject = function(e) {
    e.preventDefault();
    createNewProject(newProjectInput.value)

}
const createTodoObj = (name, dueDate, description, priority) => {
    return {name, dueDate, priority, description}
}
const findObjInList = (list, item) => {
    const ObjIndex = list.findIndex(obj => obj.name === item);
    if (ObjIndex < 0) return console.log("Problem - this is project does not exist in")
    return list[ObjIndex]
}
const createTask = (newTaskName, newTaskDate, newTaskInfo, chosenPriority, projectList, currentProject) =>{
    const newTodo = createTodoObj(newTaskName, newTaskDate, newTaskInfo, chosenPriority);
    const projectToAddTo = findObjInList(projectList, currentProject)
    addToList(projectToAddTo.toDos, newTodo)
    localStorage.setItem('storage', JSON.stringify(projectList))
    openProj(currentProject, projectList)
    closeModal(modal)
}
const createNewTodo = function(e) {
    e.preventDefault();
    if (editTask) {
        removeFromList(findObjInList(projectList, currentProject).toDos, currentTask)
    }
    const chosenPriority = selectPriority.options[selectPriority.selectedIndex];
    createTask(newTaskName.value, newTaskDate.value, newTaskInfo.value, chosenPriority.value, projectList, currentProject)
    editTask = false
}
projectForm.addEventListener('submit', submitNewProject)
todoForm.addEventListener('submit', createNewTodo)

if (projectList) {
    projectList.forEach(project => createProjectDOM(projects, project.name))
    currentProject = projectList[0]
}
else projects.innerText = "No Projects Yet"

createNewProject('clean House')
createTask('Dishes', '2022-01-01', 'Mister will do it', 'High', projectList, projectList[0].name)
createTask('kaka', '2022-02-01', 'Mister will NOT do it', 'Low', projectList, projectList[0].name)
createNewProject('Paint')
createTask('cracks', '2022-09-01', 'I will do it', 'High', projectList, projectList[1].name)
createTask('side wall', '2022-03-01', 'I will DEFINITELY do it', 'Low', projectList, projectList[1].name)
