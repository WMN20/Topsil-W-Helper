//------------------------------------------------
// Tabs
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
// Email Templates
//------------------------------------------------
function loadTemplates() {
    templateList.innerHTML = "";
    JSON.parse(localStorage.getItem("templates") || "[]").forEach((t, i) => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <b>${t.name}</b><br>
            <button onclick="navigator.clipboard.writeText(\`${t.text}\`)">Copy</button>
            <button onclick="remove('templates',${i},loadTemplates)">Delete</button>
        `;
        templateList.appendChild(div);
    });
}

function addTemplate() {
    save("templates", { name: templateName.value, text: templateInput.value });
    templateName.value = templateInput.value = "";
    loadTemplates();
}

//------------------------------------------------
// File Paths
//------------------------------------------------
function loadFolders() {
    folderList.innerHTML = "";
    JSON.parse(localStorage.getItem("folders") || "[]").forEach((f, i) => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <b>${f.name}</b><br>
            <button onclick="navigator.clipboard.writeText(\`${f.path}\`)">Copy Path</button>
            <button onclick="remove('folders',${i},loadFolders)">Delete</button>
        `;
        folderList.appendChild(div);
    });
}

function addFolder() {
    save("folders", { name: folderName.value, path: folderPath.value });
    folderName.value = folderPath.value = "";
    loadFolders();
}

//------------------------------------------------
// Sticky Notes (2 columns, grid-like)
//------------------------------------------------
function loadNotes() {
    todoBoard.innerHTML = `
        <div class="todo-column"><h3>Vigtig</h3></div>
        <div class="todo-column"><h3>Mindre vigtig</h3></div>
    `;

    const cols = todoBoard.querySelectorAll(".todo-column");
    JSON.parse(localStorage.getItem("notes") || "[]").forEach((n, i) => {
        const note = document.createElement("div");
        note.className = `note ${n.color}`;
        note.innerHTML = `
            <h4 contenteditable oninput="updateNote(${i}, 'title', this.innerText)">${n.title}</h4>
            <textarea oninput="updateNote(${i}, 'text', this.value)">${n.text}</textarea>
            <select onchange="updateColor(${i}, this.value)">
                <option value="yellow">Yellow</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="green">Green</option>
            </select>
            <select onchange="updateNote(${i}, 'priority', this.value); loadNotes();">
                <option value="important">Vigtig</option>
                <option value="normal">Mindre vigtig</option>
            </select>
            <button onclick="remove('notes',${i},loadNotes)">Delete</button>
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

function updateColor(i, v) {
    updateNote(i, "color", v);
    loadNotes();
}

//------------------------------------------------
// Dates (Danish + color rules)
//------------------------------------------------
function loadDates() {
    datesList.innerHTML = "";
    const now = new Date();
    JSON.parse(localStorage.getItem("dates") || [])
        .sort((a,b)=>new Date(a.dt)-new Date(b.dt))
        .forEach((d,i)=>{
            const dt = new Date(d.dt);
            const days = Math.ceil((dt-now)/(1000*60*60*24));
            const color = days<=3 ? "red" : days<=7 ? "yellow" : "green";
            const div = document.createElement("div");
            div.className = `date-item ${color}`;
            div.innerHTML = `
                <b>${d.t}</b><br>
                <small>${dt.toLocaleDateString("da-DK",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</small><br>
                <small>Om ${days} dage</small><br>
                <button onclick="remove('dates',${i},loadDates)">Delete</button>
            `;
            datesList.appendChild(div);
        });
}

function addDate() {
    save("dates",{ t:dateTitle.value, dt:`${dateValue.value}T${timeValue.value||"00:00"}` });
    dateTitle.value = dateValue.value = timeValue.value = "";
    loadDates();
}

//------------------------------------------------
// Helpers
//------------------------------------------------
function save(key,obj){
    const d = JSON.parse(localStorage.getItem(key)||"[]");
    d.push(obj);
    localStorage.setItem(key,JSON.stringify(d));
}
function remove(key,i,cb){
    const d = JSON.parse(localStorage.getItem(key));
    d.splice(i,1);
    localStorage.setItem(key,JSON.stringify(d));
    cb();
}

//------------------------------------------------
window.onload = () => {
    loadTemplates();
    loadFolders();
    loadNotes();
    loadDates();
};
