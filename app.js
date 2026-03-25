//---------------------------------------------------
// TAB SYSTEM
//---------------------------------------------------
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPages = document.querySelectorAll(".tab-page");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".tab-btn.active").classList.remove("active");
        btn.classList.add("active");

        document.querySelector(".tab-page.active").classList.remove("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});


//---------------------------------------------------
// EMAIL TEMPLATES
//---------------------------------------------------
function loadTemplates() {
    const list = document.getElementById("templateList");
    list.innerHTML = "";

    const templates = JSON.parse(localStorage.getItem("templates") || "[]");

    templates.forEach((tpl, i) => {
        const div = document.createElement("div");
        div.className = "templateItem";
        div.innerHTML = `
            <b>${tpl.name}</b><br>
            <button onclick="copyTemplate(${i})">Copy</button>
            <button onclick="deleteTemplate(${i})">Delete</button>
        `;
        list.appendChild(div);
    });
}

function addTemplate() {
    const name = document.getElementById("templateName").value.trim();
    const text = document.getElementById("templateInput").value.trim();

    if (!name || !text) return alert("Enter name and template text.");

    let templates = JSON.parse(localStorage.getItem("templates") || "[]");
    templates.push({ name, text });

    localStorage.setItem("templates", JSON.stringify(templates));

    loadTemplates();
}

function copyTemplate(i) {
    const templates = JSON.parse(localStorage.getItem("templates") || "[]");
    navigator.clipboard.writeText(templates[i].text);
}

function deleteTemplate(i) {
    let templates = JSON.parse(localStorage.getItem("templates") || "[]");
    templates.splice(i, 1);
    localStorage.setItem("templates", JSON.stringify(templates));
    loadTemplates();
}


//---------------------------------------------------
// FILE PATH TEMPLATES
//---------------------------------------------------
function loadFolderShortcuts() {
    const list = document.getElementById("folderList");
    list.innerHTML = "";

    const folders = JSON.parse(localStorage.getItem("folders") || "[]");

    folders.forEach((fp, i) => {
        const div = document.createElement("div");
        div.className = "templateItem";
        div.innerHTML = `
            <b>${fp.name}</b><br>
            <button onclick="copyFolderPath(${i})">Copy Path</button>
            <button onclick="deleteFolderShortcut(${i})">Delete</button>
        `;
        list.appendChild(div);
    });
}

function addFolderShortcut() {
    const name = document.getElementById("folderName").value.trim();
    const path = document.getElementById("folderPath").value.trim();

    if (!name || !path) return alert("Enter name and path.");

    let folders = JSON.parse(localStorage.getItem("folders") || "[]");
    folders.push({ name, path });

    localStorage.setItem("folders", JSON.stringify(folders));

    loadFolderShortcuts();
}

function copyFolderPath(i) {
    const folders = JSON.parse(localStorage.getItem("folders") || "[]");
    navigator.clipboard.writeText(folders[i].path);
}

function deleteFolderShortcut(i) {
    let folders = JSON.parse(localStorage.getItem("folders") || "[]");
    folders.splice(i, 1);
    localStorage.setItem("folders", JSON.stringify(folders));
    loadFolderShortcuts();
}


//---------------------------------------------------
// STICKY NOTES + DRAG & DROP + SAVE
//---------------------------------------------------
function loadNotes() {
    const board = document.getElementById("todoBoard");
    board.innerHTML = "";

    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    notes.forEach((n, i) => createNoteElement(n, i));
}

function addNote() {
    let notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const newNote = {
        title: "New Task",
        text: "",
        x: 50,
        y: 50
    };
    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));

    loadNotes();
}

function createNoteElement(note, index) {
    const board = document.getElementById("todoBoard");

    const div = document.createElement("div");
    div.className = "note";
    div.style.left = note.x + "px";
    div.style.top = note.y + "px";

    div.innerHTML = `
        <h4 contenteditable="true" oninput="updateNoteTitle(${index}, this.innerText)">${note.title}</h4>
        <textarea oninput="updateNoteText(${index}, this.value)">${note.text}</textarea>
        <button onclick="deleteNote(${index})">Delete</button>
    `;

    enableDrag(div, index);
    board.appendChild(div);
}

function updateNoteTitle(i, text) {
    let notes = JSON.parse(localStorage.getItem("notes") || "[]");
    notes[i].title = text;
    localStorage.setItem("notes", JSON.stringify(notes));
}

function updateNoteText(i, text) {
    let notes = JSON.parse(localStorage.getItem("notes") || "[]");
    notes[i].text = text;
    localStorage.setItem("notes", JSON.stringify(notes));
}

function deleteNote(i) {
    let notes = JSON.parse(localStorage.getItem("notes") || "[]");
    notes.splice(i, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
}


// Dragging Notes
function enableDrag(el, index) {
    let offsetX, offsetY;

    el.onmousedown = (e) => {
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;

        document.onmousemove = (e) => {
            el.style.left = (e.clientX - offsetX) + "px";
            el.style.top = (e.clientY - offsetY) + "px";

            let notes = JSON.parse(localStorage.getItem("notes") || "[]");
            notes[index].x = el.offsetLeft;
            notes[index].y = el.offsetTop;
            localStorage.setItem("notes", JSON.stringify(notes));
        };

        document.onmouseup = () => {
            document.onmousemove = null;
        };
    };
}


//---------------------------------------------------
// INIT
//---------------------------------------------------
window.onload = () => {
    loadTemplates();
    loadFolderShortcuts();
    loadNotes();
};
