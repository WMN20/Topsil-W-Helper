//------------------------------------------------//------------------------------------------------
//------------------------------------------------
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelector(".tab-btn.active").classList.remove("active");
        document.querySelector(".tab-page.active").classList.remove("active");
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    };
});

//------------------------------------------------
// Helpers
//------------------------------------------------
function save(key, obj) {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    data.push(obj);
    localStorage.setItem(key, JSON.stringify(data));
}

function removeItem(key, i, cb) {
    const data = JSON.parse(localStorage.getItem(key));
    data.splice(i, 1);
    localStorage.setItem(key, JSON.stringify(data));
    cb();
}

//------------------------------------------------
// Email Templates
//------------------------------------------------
function loadTemplates() {
    templateList.innerHTML = "";
    JSON.parse(localStorage.getItem("templates") || []).forEach((t, i) => {
        const d = document.createElement("div");
        d.className = "card";
        d.innerHTML = `
            <b>${t.name}</b><br>
            <button onclick="navigator.clipboard.writeText(\`${t.text}\`)">Copy</button>
            <button onclick="removeItem('templates',${i},loadTemplates)">Delete</button>
        `;
        templateList.appendChild(d);
    });
}

function addTemplate() {
    save("templates", {
        name: templateName.value,
        text: templateInput.value
    });
    templateName.value = "";
    templateInput.value = "";
    loadTemplates();
}

//------------------------------------------------
// File Paths
//------------------------------------------------
function loadFolders() {
    folderList.innerHTML = "";
    JSON.parse(localStorage.getItem("folders") || []).forEach((f, i) => {
        const d = document.createElement("div");
        d.className = "card";
        d.innerHTML = `
            <b>${f.name}</b><br>
            <button onclick="navigator.clipboard.writeText(\`${f.path}\`)">Copy Path</button>
            <button onclick="removeItem('folders',${i},loadFolders)">Delete</button>
        `;
        folderList.appendChild(d);
    });
}

function addFolder() {
    save("folders", {
        name: folderName.value,
        path: folderPath.value
    });
    folderName.value = "";
    folderPath.value = "";
    loadFolders();
}

//------------------------------------------------
// Sticky Notes (GRID VERSION)
//------------------------------------------------
function loadNotes() {
    todoBoard.innerHTML = `
        <div class="todo-column"><h3>Vigtig</h3></div>
        <div class="todo-column"><h3>Mindre vigtig</h3></div>
    `;

    const cols = todoBoard.querySelectorAll(".todo-column");
    JSON.parse(localStorage.getItem("notes") || []).forEach((n, i) => {
        const note = document.createElement("div");
        note.className = `note ${n.color}`;
        note.innerHTML = `
            <h4 contenteditable oninput="updateNote(${i},'title',this.innerText)">${n.title}</h4>
            <textarea oninput="updateNote(${i},'text',this.value)">${n.text}</textarea>
            <select onchange="updateNote(${i},'color',this.value); loadNotes();">
                <option value="yellow">Yellow</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="green">Green</option>
            </select>
            <select onchange="updateNote(${i},'priority',this.value); loadNotes();">
                <option value="important">Vigtig</option>
                <option value="normal">Mindre vigtig</option>
            </select>
            <button onclick="removeItem('notes',${i},loadNotes)">Delete</button>
        `;
        note.querySelectorAll("select")[0].value = n.color;
        note.querySelectorAll("select")[1].value = n.priority;
        cols[n.priority === "important" ? 0 : 1].appendChild(note);
    });
}

function addNote() {
    save("notes", {
        title: "Title",
        text: "",
        color: "yellow",
        priority: "important"
    });
    loadNotes();
}

function updateNote(i, k, v) {
    const n = JSON.parse(localStorage.getItem("notes"));
    n[i][k] = v;
    localStorage.setItem("notes", JSON.stringify(n));
}

//------------------------------------------------
// Dates (SIMPLE, STABLE)
//------------------------------------------------
function loadDates() {
    datesList.innerHTML = "";
    JSON.parse(localStorage.getItem("dates") || []).forEach((d, i) => {
        const div = document.createElement("div");
        div.className = "date-item";
        div.innerHTML = `
            <b>${d.title}</b><br>
            <small>${d.date}</small><br>
            <button onclick="removeItem('dates',${i},loadDates)">Delete</button>
        `;
        datesList.appendChild(div);
    });
}

function addDate() {
    save("dates", {
        title: dateTitle.value,
        date: dateValue.value
    });
    dateTitle.value = "";
    dateValue.value = "";
    loadDates();
}

//------------------------------------------------
window.onload = () => {
    loadTemplates();
    loadFolders();
    loadNotes();
    loadDates();
};
``
