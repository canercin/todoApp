let tasks = [];

// Görev listesinin bulunduğu kısım seçiliyor.
const taskList = document.getElementById("task-list");
// Görev ekleme butonu seçiliyor ve ilgili ekleme fonksiyonu kullanılmak üzere eventListener olarak ekleniyor.
const addTaskButton = document.getElementById("addTaskButton");
addTaskButton.addEventListener("click", addTask);
// Bütün görevleri silme fonksiyonu seçiliyor ve ilgili silme fonksiyonu kullanılmak üzere eventListener olarak ekleniyor.
const clearAllTasksButton = document.getElementById("buttonClear");
clearAllTasksButton.addEventListener("click", clearAllTasks);
// Görev listesindeki görevlerin durumlarına göre filtreleme elemanı seçiliyor ve ilgili fonksiyon kullanılmak üzere eventListener olarak elemana ekleniyor.
const allTasks = document.getElementById("allTasks");
allTasks.addEventListener("click", showAllTasks);
const activeTasks = document.getElementById("activeTasks");
activeTasks.addEventListener("click", showActiveTasks);
const completedTasks = document.getElementById("completedTasks");
completedTasks.addEventListener("click", showCompletedTasks);
// ----------------------------
/**
 * @param {*[]} tasks Filtreleme elemanına göre filtrelenmiş görevlerin bulunduğu dizi.
 * @description Filtrelenmiş görev listesindeki görevleri ekrana yazdıran fonksiyon.
 */
function renderTasks(tasks) {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        taskList.innerHTML = `<h3 class="text-center">Görev Bulunamadı</h3>`
    }
    tasks.forEach(task => {
        let status = task.isDone ? "checked" : "";
        let taskClass = task.isDone ? "text-decoration-line-through" : "";
        taskList.innerHTML +=
            `
            <li class="form-check">
                   <input type="checkbox" id="task${task.id}" class="form-check-input" ${status} onclick="changeStatus(${task.id})">
                   <label for="task${task.id}" class="form-check-label ${taskClass}">${task.task}</label>
                   <div class="float-end">
                       <button class="btn btn-sm btn-danger" id="delete${task.id}" onclick="deleteTask(${task.id})">Delete</button>
                       <button class="btn btn-sm btn-warning" id="popUpOpen${task.id}" onclick="popUpOpen(${task.id})">Edit</button>
                   </div>
                   <div class="card popup${task.id}" style="display: none; position: relative">
                        <div class="card-header">
                            Güncelleme Paneli
                        </div>
                        <div class="card-body">
                            <input type="text" class="form-control" id="updateTaskText${task.id}" placeholder="Güncellemek istediğiniz taskı giriniz">
                            <button class="btn btn-sm btn-success" id="updateTaskButton${task.id}" onclick="updateTask(${task.id})">Güncelle</button>
                        </div>
                   </div>
                   <hr>
            </li>
            `
    });
}

/**
 * @description Görev ekleme fonksiyonu.
 */
function addTask() {
    let newTask = document.getElementById("addTaskText").value;
    if (newTask !== "") {
        tasks.push({"id": tasks.length + 1, "task": newTask, "isDone": null});
        localStorage.setItem("tasks", JSON.stringify(tasks));
        wrapperRender();
    } else {
        alert("Lütfen bir görev giriniz.")
    }
}

/**
 * @param {number} id Görevin id'si.
 * @description Görev silme fonksiyonu.
 * */
function deleteTask(id) {
    let deleteTask = tasks.find(task => task.id === id);
    tasks.splice(tasks.indexOf(deleteTask), 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    wrapperRender()
}

/**
 * @param {number} id Görevin id'si.
 * @description Görevi güncelleme fonksiyonu.
 * */
function updateTask(id) {
    if (document.getElementById(`updateTaskText${id}`).value !== "") {
        tasks[id - 1].task = document.getElementById(`updateTaskText${id}`).value;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        wrapperRender();
    } else {
        alert("Lütfen bir yeni görev giriniz.")
    }
}

/**
 * @param {number} id Görevin id'si.
 * @description Görev güncelleme panelini açma fonksiyonu.
 * */
function popUpOpen(id) {
    document.querySelector(`.popup${id}`).style.display === "none" ? document.querySelector(`.popup${id}`).style.display = "flex" : document.querySelector(`.popup${id}`).style.display = "none"
}

/**
 * @description Bütün görevleri silme fonksiyonu.
 * */
function clearAllTasks() {
    tasks = [];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    wrapperRender();
}

/**
 * @description Görevin durumunu değiştirme fonksiyonu.
 * @param {number} id Görevin id'si.
 * */
function changeStatus(id) {
    tasks[id - 1].isDone = !tasks[id - 1].isDone;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    wrapperRender();
}

/**
 * @description Bütün görevleri gösterme fonksiyonu.
 * */
function showAllTasks() {
    renderTasks(tasks);
}

/**
 * @description Aktif görevleri gösterme fonksiyonu.
 * */
function showActiveTasks() {
    renderTasks(tasks.filter(task => task.isDone !== true));
}

/**
 * @description Tamamlanmış görevleri gösterme fonksiyonu.
 * */
function showCompletedTasks() {
    renderTasks(tasks.filter(task => task.isDone === true));
}

/**
 * @description En son seçili filtreleme elemanını bulan fonksiyon.
 * */
function find() {
    let buttons = document.querySelectorAll("input[type='radio']");
    let selectedButton = Array.from(buttons).find(button => button.checked).getAttribute("id");
    return selectedButton.toString();
}

/**
 * @description En son çalıştırılan filtreleme elemanını bulan fonksiyon.
 * @description Sayfa yüklenirken default olarak showAllTasks fonksiyonunu çalıştırır.
 * */
function wrapperRender() {
    let letter = find();

    if (localStorage.getItem("tasks") === null) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }

    switch (letter) {
        case "allTasks":
            document.getElementById("allTasks").click();
            break;
        case "activeTasks":
            document.getElementById("activeTasks").click();
            break;
        case "completedTasks":
            document.getElementById("completedTasks").click();
            break;
        default:
            document.getElementById("allTasks").click();
            break;
    }
}

// Sayfa yüklendiğinde görev listesini göstermek amacıyla wrapperRender fonksiyonunu çalıştırır.
document.addEventListener("DOMContentLoaded", wrapperRender);