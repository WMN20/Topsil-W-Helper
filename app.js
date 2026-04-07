//------------------------------------------------
// TABS
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
// EMAIL TEMPLATES
//------------------------------------------------
function loadTemplates() {
    templateList.innerHTML = "";
    const data = JSON.parse(localStorage.getItem("templates") || "[]");
    data.forEach((t, i) => {
        templateList.innerHTML += `
            <div class="card">
                <b>${t.name}</b><br>
                <button onclick="navigator.clipboard.writeText(\`${t.text}\`)">Copy</button>
                <button onclick="deleteItem('templates',${i},loadTemplates)">Delete</button>
            </div>`;
    });
}

function addTemplate() {
    saveItem("templates", { name: templateName.value, text: templateInput.value });
    templateName.value = templateInput.value = "";
    loadTemplates();
}

//------------------------------------------------
// FILE PATHS
//------------------------------------------------
function loadFolders() {
    folderList.innerHTML = "";
    const data = JSON.parse(localStorage.getItem("folders") || "[]");
    data.forEach((f, i) => {
        folderList.innerHTML += `
            <div class="card">
                <b>${f.name}</b><br>
                <button onclick="navigator.clipboard.writeText(\`${f.path}\`)">Copy Path</button>
                <button onclick="deleteItem('folders',${i},loadFolders)">Delete</button>
            </div>`;
    });
}

function addFolder() {
    saveItem("folders", { name: folderName.value, path: folderPath.value });
    folderName.value = folderPath.value = "";
    loadFolders();
}

//------------------------------------------------
// STICKY NOTES (RESTORED + COLORS)
//------------------------------------------------
function loadNotes() {
    todoBoard.innerHTML = "";
    (JSON.parse(localStorage.getItem("notes") || "[]"))
        .forEach((n, i) => createNote(n, i));
}

function addNote() {
    saveItem("notes", {
        title: "Title",
        text: "",
        x: 40,
        y: 40,
        color: "yellow"
    });
    loadNotes();
}

function createNote(n, i) {
    const div = document.createElement("div");
    div.className = `note ${n.color}`;
    div.style.left = n.x + "px";
    div.style.top = n.y + "px";

    div.innerHTML = `
        <h4 contenteditable oninput="updateNote(${i},'title',this.innerText)">${n.title}</h4>
        <textarea oninput="updateNote(${i},'text',this.value)">${n.text}</textarea>
        <select onchange="updateNote(${i},'color',this.value)">
            <option value="yellow">Yellow</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
        </select>
        <button onclick="deleteNote(${i})">Delete</button>
    `;

    div.querySelector("select").value = n.color;

    enableDrag(div, i);
    todoBoard.appendChild(div);
}

function updateNote(i, key, value) {
    let notes = JSON.parse(localStorage.getItem("notes"));
    notes[i][key] = value;
    localStorage.setItem("notes", JSON.stringify(notes));
}

function deleteNote(i) {
    let notes = JSON.parse(localStorage.getItem("notes"));
    notes.splice(i, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
}

function enableDrag(el, i) {
    el.onmousedown = () => {
        document.onmousemove = e => {
            el.style.left = e.clientX - 100 + "px";
            el.style.top = e.clientY - 30 + "px";
            let notes = JSON.parse(localStorage.getItem("notes"));
            notes[i].x = el.offsetLeft;
            notes[i].y = el.offsetTop;
            localStorage.setItem("notes", JSON.stringify(notes));
        };
        document.onmouseup = () => document.onmousemove = null;
    };
}

//------------------------------------------------
// DATES (weekday + today)
//------------------------------------------------
function loadDates() {
    datesList.innerHTML = "";
    let d = JSON.parse(localStorage.getItem("dates") || "[]");
    d.sort((a,b)=>new Date(a.dt)-new Date(b.dt));

    const today = new Date().toDateString();

    d.forEach((x,i)=>{
        const dt = new Date(x.dt);
        const isToday = dt.toDateString() === today;

        datesList.innerHTML += `
            <div class="date-item ${isToday ? "today" : ""}">
                <b>${x.t}</b><br>
                <small>
                    ${dt.toLocaleDateString('en-GB',{
                        weekday:'long',
                        year:'numeric',
                        month:'long',
                        day:'numeric'
                    })} ${dt.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </small><br>
                <button onclick="deleteItem('dates',${i},loadDates)">Delete</button>
            </div>`;
    });
}

function addDate() {
    if(!dateTitle.value || !dateValue.value) return;
    saveItem("dates", {
        t: dateTitle.value,
        dt: `${dateValue.value}T${timeValue.value || "00:00"}`
    });
    dateTitle.value = dateValue.value = timeValue.value = "";
    loadDates();
}

//------------------------------------------------
// HELPERS + INIT
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

window.onload = () => {
    loadTemplates();
    loadFolders();
    loadNotes();
    loadDates();
};
``
