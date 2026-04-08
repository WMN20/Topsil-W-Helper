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
                <button onclick="deleteItem('templates', ${i}, loadTemplates)">Delete</button>
            </div>
        `;
    });
}

function addTemplate() {
    saveItem("templates", {
        name: templateName.value,
        text: templateInput.value
    });
    templateName.value = "";
    templateInput.value = "";
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
                <button onclick="deleteItem('folders', ${i}, loadFolders)">Delete</button>
            </div>
        `;
    });
}

function addFolder() {
    saveItem("folders", {
        name: folderName.value,
        path: folderPath.value
    });
    folderName.value = "";
    folderPath.value = "";
    loadFolders();
}

//------------------------------------------------
// STICKY NOTES (FIXED)
//------------------------------------------------
function loadNotes() {
    todoBoard.innerHTML = "";
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    notes.forEach((n, i) => createNote(n, i));
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

function createNote(note, index) {
    const div = document.createElement("div");
    div.className = `note ${note.color}`;
    div.style.left = note.x + "px";
    div.style.top  = note.y + "px";

    div.innerHTML = `
        <h4 contenteditable
            oninput="updateNote(${index}, 'title', this.innerText)">
            ${note.title}
        </h4>

        <textarea
            oninput="updateNote(${index}, 'text', this.value)">
            ${note.text}
        </textarea>

        <select onchange="changeNoteColor(this, ${index})">
            <option value="yellow">Yellow</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
        </select>

        <button onclick="deleteNote(${index})">Delete</button>
    `;

    div.querySelector("select").value = note.color;

    enableDrag(div, index);
    todoBoard.appendChild(div);
}

function updateNote(index, key, value) {
    const notes = JSON.parse(localStorage.getItem("notes"));
    notes[index][key] = value;
    localStorage.setItem("notes", JSON.stringify(notes));
}

// ✅ IMMEDIATE color update
function changeNoteColor(select, index) {
    const notes = JSON.parse(localStorage.getItem("notes"));
    notes[index].color = select.value;
    localStorage.setItem("notes", JSON.stringify(notes));

    select.parentElement.className = `note ${select.value}`;
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem("notes"));
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
}

// ✅ PROPER drag logic (no jumping)
function enableDrag(el, index) {
    let offsetX = 0;
    let offsetY = 0;

    el.onmousedown = (e) => {
        offsetX = e.offsetX;
        offsetY = e.offsetY;

        document.onmousemove = (ev) => {
            el.style.left = (ev.pageX - offsetX) + "px";
            el.style.top  = (ev.pageY - offsetY) + "px";

            const notes = JSON.parse(localStorage.getItem("notes"));
            notes[index].x = el.offsetLeft;
            notes[index].y = el.offsetTop;
            localStorage.setItem("notes", JSON.stringify(notes));
        };

        document.onmouseup = () => {
            document.onmousemove = null;
        };
    };
}

//------------------------------------------------
// DATES (DANISH + TODAY MARK)
//------------------------------------------------
function loadDates() {
    datesList.innerHTML = "";
    let dates = JSON.parse(localStorage.getItem("dates") || "[]");

    dates.sort((a, b) => new Date(a.dt) - new Date(b.dt));

    const todayStr = new Date().toDateString();

    dates.forEach((d, i) => {
        const dateObj = new Date(d.dt);
        const isToday = dateObj.toDateString() === todayStr;

        const formatted = dateObj.toLocaleDateString("da-DK", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        const time = dateObj.toLocaleTimeString("da-DK", {
            hour: "2-digit",
            minute: "2-digit"
        });

        datesList.innerHTML += `
            <div class="date-item ${isToday ? "today" : ""}">
                <b>${d.t}</b><br>
                <small>${formatted} kl. ${time}</small><br>
                <button onclick="deleteItem('dates', ${i}, loadDates)">Delete</button>
            </div>
        `;
    });
}

function addDate() {
    if (!dateTitle.value || !dateValue.value) return;

    saveItem("dates", {
        t: dateTitle.value,
        dt: `${dateValue.value}T${timeValue.value || "00:00"}`
    });

    dateTitle.value = "";
    dateValue.value = "";
    timeValue.value = "";
    loadDates();
}

//------------------------------------------------
// HELPERS
//------------------------------------------------
function saveItem(key, item) {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    data.push(item);
    localStorage.setItem(key, JSON.stringify(data));
}

function deleteItem(key, index, cb) {
    const data = JSON.parse(localStorage.getItem(key));
    data.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(data));
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
