//------------------------------------------------
// TABS
//------------------------------------------------
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelector(".tab-btn.active").classList.remove("active");
        document.querySelector(".tab-page.active").classList.remove("active");
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    }
});

//------------------------------------------------
// EMAIL TEMPLATES
//------------------------------------------------
function loadTemplates() {
    const list = document.getElementById("templateList");
    list.innerHTML = "";
    const data = JSON.parse(localStorage.getItem("templates") || "[]");
    data.forEach((t, i) => {
        list.innerHTML += `
            <div class="card">
                <b>${t.name}</b><br>
                <button onclick="navigator.clipboard.writeText(\`${t.text}\`)">Copy</button>
                <button onclick="deleteItem('templates',${i},loadTemplates)">Delete</button>
            </div>`;
    });
}

function addTemplate() {
    saveItem("templates", {
        name: templateName.value,
        text: templateInput.value
    });
    templateName.value = templateInput.value = "";
    loadTemplates();
}

//------------------------------------------------
// FILE PATHS
//------------------------------------------------
function loadFolders() {
    const list = folderList;
    list.innerHTML = "";
    const data = JSON.parse(localStorage.getItem("folders") || "[]");
    data.forEach((f, i) => {
        list.innerHTML += `
            <div class="card">
                <b>${f.name}</b><br>
                <button onclick="navigator.clipboard.writeText(\`${f.path}\`)">Copy Path</button>
                <button onclick="deleteItem('folders',${i},loadFolders)">Delete</button>
            </div>`;
    });
}

function addFolder() {
    saveItem("folders", {
        name: folderName.value,
        path: folderPath.value
    });
    folderName.value = folderPath.value = "";
    loadFolders();
}

//------------------------------------------------
// TODO NOTES
//------------------------------------------------
function loadNotes() {
    const board = todoBoard;
    board.innerHTML = "";
    JSON.parse(localStorage.getItem("notes") || "[]")
        .forEach((n, i) => createNote(n, i));
}

function addNote() {
    saveItem("notes", { text: "", x: 50, y: 50 });
    loadNotes();
}

function createNote(n, i) {
    const div = document.createElement("div");
    div.className = "note";
    div.style.left = n.x + "px";
    div.style.top = n.y + "px";
    div.innerHTML = `<textarea oninput="updateNote(${i},this.value)">${n.text}</textarea>`;
    enableDrag(div, i);
    todoBoard.appendChild(div);
}

function updateNote(i, v) {
    let n = JSON.parse(localStorage.getItem("notes"));
    n[i].text = v;
    localStorage.setItem("notes", JSON.stringify(n));
}

function enableDrag(el, i) {
    el.onmousedown = e => {
        document.onmousemove = ev => {
            el.style.left = ev.clientX - 100 + "px";
            el.style.top = ev.clientY - 20 + "px";
            let n = JSON.parse(localStorage.getItem("notes"));
            n[i].x = el.offsetLeft;
            n[i].y = el.offsetTop;
            localStorage.setItem("notes", JSON.stringify(n));
        }
        document.onmouseup = () => document.onmousemove = null;
    }
}

//------------------------------------------------
// DATES
//------------------------------------------------
function loadDates() {
    const list = datesList;
    list.innerHTML = "";
    let d = JSON.parse(localStorage.getItem("dates") || "[]");
    d.sort((a,b)=>new Date(a.dt)-new Date(b.dt));
    d.forEach((x,i)=> {
        list.innerHTML += `
            <div class="date-item">
                <b>${x.t}</b><br>
                <small>${new Date(x.dt).toLocaleString()}</small>
                <br><button onclick="deleteItem('dates',${i},loadDates)">Delete</button>
            </div>`;
    });
}

function addDate() {
    if(!dateTitle.value || !dateValue.value) return;
    saveItem("dates", { 
        t: dateTitle.value, 
        dt: `${dateValue.value}T${timeValue.value||"00:00"}`
    });
    dateTitle.value = dateValue.value = timeValue.value = "";
    loadDates();
}

//------------------------------------------------
// HELPERS
//------------------------------------------------
function saveItem(key, item) {
    let d = JSON.parse(localStorage.getItem(key) || "[]");
    d.push(item);
    localStorage.setItem(key, JSON.stringify(d));
}

function deleteItem(key, i, cb) {
    let d = JSON.parse(localStorage.getItem(key));
    d.splice(i,1);
    localStorage.setItem(key, JSON.stringify(d));
    cb();
}

//------------------------------------------------
// INIT
//------------------------------------------------
window.onload = () => {
    loadTemplates();
    loadFolders();
    loadNotes();
    loadDates();
};
``
