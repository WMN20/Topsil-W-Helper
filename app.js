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
        const div = document.createElement("div");
        div.className = "card";

        const b = document.createElement("b");
        b.textContent = t.name;

        const copy = document.createElement("button");
        copy.textContent = "Copy";
        copy.onclick = () => navigator.clipboard.writeText(t.text);

        const del = document.createElement("button");
        del.textContent = "Delete";
        del.onclick = () => deleteItem("templates", i, loadTemplates);

        div.append(b, document.createElement("br"), copy, del);
        templateList.appendChild(div);
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
        const div = document.createElement("div");
        div.className = "card";

        const b = document.createElement("b");
        b.textContent = f.name;

        const copy = document.createElement("button");
        copy.textContent = "Copy Path";
        copy.onclick = () => navigator.clipboard.writeText(f.path);

        const del = document.createElement("button");
        del.textContent = "Delete";
        del.onclick = () => deleteItem("folders", i, loadFolders);

        div.append(b, document.createElement("br"), copy, del);
        folderList.appendChild(div);
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
// STICKY NOTES (BUGFIXED)
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
    div.style.top = note.y + "px";

    // Title
    const title = document.createElement("h4");
    title.contentEditable = true;
    title.textContent = note.title;
    title.oninput = () => updateNote(index, "title", title.textContent);

    // Text (NO leading whitespace bug)
    const textarea = document.createElement("textarea");
    textarea.value = note.text;
    textarea.oninput = () => updateNote(index, "text", textarea.value);

    // Color select (instant update)
    const select = document.createElement("select");
    ["yellow","red","blue","purple","green"].forEach(c => {
        const o = document.createElement("option");
        o.value = c;
        o.textContent = c;
        select.appendChild(o);
    });
    select.value = note.color;
    select.onchange = () => {
        updateNote(index, "color", select.value);
        div.className = `note ${select.value}`;
    };

    // Delete
    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => deleteNote(index);

    div.append(title, textarea, select, del);
    enableDrag(div, index);
    todoBoard.appendChild(div);
}

function updateNote(index, key, value) {
    const notes = JSON.parse(localStorage.getItem("notes"));
    notes[index][key] = value;
    localStorage.setItem("notes", JSON.stringify(notes));
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem("notes"));
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
}

// ✅ DRAG FIX – no teleporting
function enableDrag(el, index) {
    let startX, startY, startLeft, startTop;

    el.onmousedown = (e) => {
        const rect = el.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        startLeft = rect.left + window.scrollX;
        startTop = rect.top + window.scrollY;

        document.onmousemove = (ev) => {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;

            el.style.left = startLeft + dx + "px";
            el.style.top = startTop + dy + "px";

            const notes = JSON.parse(localStorage.getItem("notes"));
            notes[index].x = el.offsetLeft;
            notes[index].y = el.offsetTop;
            localStorage.setItem("notes", JSON.stringify(notes));
        };

        document.onmouseup = () => document.onmousemove = null;
    };
}

//------------------------------------------------
// DATES + DANISH + COUNTDOWN
//------------------------------------------------
function loadDates() {
    datesList.innerHTML = "";
    let dates = JSON.parse(localStorage.getItem("dates") || "[]");
    dates.sort((a,b)=>new Date(a.dt)-new Date(b.dt));

    const now = new Date();

    dates.forEach((d, i) => {
        const dateObj = new Date(d.dt);
        const diffMs = dateObj - now;

        let countdown;
        if (diffMs < 0) {
            countdown = "Forfalden";
        } else {
            const days = Math.floor(diffMs / (1000*60*60*24));
            const hours = Math.floor((diffMs / (1000*60*60)) % 24);
            countdown = days === 0
                ? `I dag (${hours} timer)`
                : `Om ${days} dage`;
        }

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

        const div = document.createElement("div");
        div.className = "date-item";
        div.innerHTML = `
            <b>${d.t}</b><br>
            <small>${formatted} kl. ${time}</small><br>
            <small><i>${countdown}</i></small><br>
            <button onclick="deleteItem('dates', ${i}, loadDates)">Delete</button>
        `;
        datesList.appendChild(div);
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
// HELPERS + INIT
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

window.onload = () => {
    loadTemplates();
    loadFolders();
    loadNotes();
    loadDates();
};
