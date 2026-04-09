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
// Sticky Note Color Legend
//------------------------------------------------
const COLORS = ["yellow", "red", "blue", "purple", "green"];

function loadLegend() {
    colorLegend.innerHTML = "";
    const data = JSON.parse(localStorage.getItem("legend") || "{}");

    COLORS.forEach(c => {
        const div = document.createElement("div");
        div.className = "legend-item";
        div.innerHTML = `
            <div class="legend-color" style="background:${getColorHex(c)}"></div>
            <input value="${data[c] || ""}" placeholder="Meaning..."
                oninput="updateLegend('${c}', this.value)">
        `;
        colorLegend.appendChild(div);
    });
}

function updateLegend(color, text) {
    const l = JSON.parse(localStorage.getItem("legend") || "{}");
    l[color] = text;
    localStorage.setItem("legend", JSON.stringify(l));
}

function getColorHex(c) {
    return {
        yellow: "#fff7ad",
        red: "#ffd6d6",
        blue: "#d6ecff",
        purple: "#ead6ff",
        green: "#ddffd6"
    }[c];
}

//------------------------------------------------
// Sticky Notes
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
                ${COLORS.map(c => `<option value="${c}">${c}</option>`).join("")}
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
// Dates with color logic
//------------------------------------------------
function loadDates() {
    datesList.innerHTML = "";
    const today = new Date();

    JSON.parse(localStorage.getItem("dates") || []).forEach((d, i) => {
        const target = new Date(d.date);
        const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

        let cls = "date-green";
        if (diffDays <= 3) cls = "date-red";
        else if (diffDays <= 7) cls = "date-yellow";

        const div = document.createElement("div");
        div.className = `date-item ${cls}`;
        div.innerHTML = `
            <b>${d.title}</b><br>
            <small>${d.date} (${diffDays} days)</small><br>
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
    loadLegend();
    loadNotes();
    loadDates();
};
