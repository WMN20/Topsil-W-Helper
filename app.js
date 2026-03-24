//------------------------------------------------
// EMAIL TEMPLATES (Saves in localStorage)
//------------------------------------------------

function loadTemplates() {
    const container = document.getElementById("templateList");
    container.innerHTML = "";

    const templates = JSON.parse(localStorage.getItem("templates") || "[]");

    templates.forEach((t, index) => {
        const div = document.createElement("div");
        div.className = "templateItem";
        div.innerHTML = `
            <b>${t.name}</b><br>
            <button onclick="copyTemplate(${index})">Copy</button>
            <button onclick="deleteTemplate(${index})">Delete</button>
        `;
        container.appendChild(div);
    });
}

function addTemplate() {
    const name = document.getElementById("templateName").value.trim();
    const text = document.getElementById("templateInput").value.trim();

    if (!name || !text) return alert("Enter name and text.");

    const templates = JSON.parse(localStorage.getItem("templates") || "[]");
    templates.push({ name, text });

    localStorage.setItem("templates", JSON.stringify(templates));

    document.getElementById("templateName").value = "";
    document.getElementById("templateInput").value = "";

    loadTemplates();
}

function copyTemplate(index) {
    const templates = JSON.parse(localStorage.getItem("templates") || "[]");
    navigator.clipboard.writeText(templates[index].text);
}

function deleteTemplate(index) {
    const templates = JSON.parse(localStorage.getItem("templates") || "[]");
    templates.splice(index, 1);
    localStorage.setItem("templates", JSON.stringify(templates));
    loadTemplates();
}



//------------------------------------------------
// FOLDER PATH SHORTCUTS (Also saved in localStorage)
//------------------------------------------------

function loadFolderShortcuts() {
    const container = document.getElementById("folderList");
    container.innerHTML = "";

    const folders = JSON.parse(localStorage.getItem("folders") || "[]");

    folders.forEach((f, index) => {
        const div = document.createElement("div");
        div.className = "templateItem";
        div.innerHTML = `
            <b>${f.name}</b><br>
            <button onclick="copyFolderPath(${index})">Copy Path</button>
            <button onclick="deleteFolderShortcut(${index})">Delete</button>
        `;
        container.appendChild(div);
    });
}

function addFolderShortcut() {
    const name = document.getElementById("folderName").value.trim();
    const path = document.getElementById("folderPath").value.trim();

    if (!name || !path) return alert("Enter name and path.");

    const folders = JSON.parse(localStorage.getItem("folders") || "[]");
    folders.push({ name, path });

    localStorage.setItem("folders", JSON.stringify(folders));

    document.getElementById("folderName").value = "";
    document.getElementById("folderPath").value = "";

    loadFolderShortcuts();
}

function copyFolderPath(index) {
    const folders = JSON.parse(localStorage.getItem("folders") || "[]");
    navigator.clipboard.writeText(folders[index].path);
}

function deleteFolderShortcut(index) {
    const folders = JSON.parse(localStorage.getItem("folders") || "[]");
    folders.splice(index, 1);
    localStorage.setItem("folders", JSON.stringify(folders));
    loadFolderShortcuts();
}



//------------------------------------------------
// INIT — Loads saved data on every refresh
//------------------------------------------------

window.onload = () => {
    loadTemplates();
    loadFolderShortcuts();
};
``
