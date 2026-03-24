//-----------------------------------------------
// EMAIL TEMPLATES
//-----------------------------------------------

function loadTemplates() {
    const container = document.getElementById("templateList");
    container.innerHTML = "";

    const templates = JSON.parse(localStorage.getItem("templates") || "[]");

    templates.forEach((t, index) => {
        const div = document.createElement("div");
        div.className = "templateItem";
        div.innerHTML = `
            <b>${t.name}</b><br>
            <button onclick="copyTemplate(${index})">Copy to Clipboard</button>
            <button onclick="deleteTemplate(${index})">Delete</button>
        `;
        container.appendChild(div);
    });
}

function addTemplate() {
    const name = document.getElementById("templateName").value.trim();
    const text = document.getElementById("templateInput").value.trim();

    if (!name || !text) return alert("Please enter both a name and template text.");

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
    alert("Copied to clipboard!");
}

function deleteTemplate(index) {
    const templates = JSON.parse(localStorage.getItem("templates") || "[]");
    templates.splice(index, 1);
    localStorage.setItem("templates", JSON.stringify(templates));
    loadTemplates();
}



//-----------------------------------------------
// FOLDER SHORTCUTS
//-----------------------------------------------

function loadFolderShortcuts() {
    const container = document.getElementById("folderList");
    container.innerHTML = "";

    const shortcuts = JSON.parse(localStorage.getItem("folders") || "[]");

    shortcuts.forEach((f, index) => {
        const div = document.createElement("div");
        div.className = "templateItem";
        div.innerHTML = `
            <b>${f.name}</b><br>
            <a href="file:///${f.path.replace(/\\/g, "/")}" target="_blank">
                <button>Open Folder</button>
            </a>
            <button onclick="deleteFolderShortcut(${index})">Delete</button>
        `;
        container.appendChild(div);
    });
}

function addFolderShortcut() {
    const name = document.getElementById("folderName").value.trim();
    const path = document.getElementById("folderPath").value.trim();

    if (!name || !path) return alert("Please enter both a name and folder path.");

    const shortcuts = JSON.parse(localStorage.getItem("folders") || "[]");
    shortcuts.push({ name, path });
    localStorage.setItem("folders", JSON.stringify(shortcuts));

    document.getElementById("folderName").value = "";
    document.getElementById("folderPath").value = "";

    loadFolderShortcuts();
}

function deleteFolderShortcut(index) {
    const shortcuts = JSON.parse(localStorage.getItem("folders") || "[]");
    shortcuts.splice(index, 1);
    localStorage.setItem("folders", JSON.stringify(shortcuts));
    loadFolderShortcuts();
}



//-----------------------------------------------
// INITIALIZATION
//-----------------------------------------------

window.onload = () => {
    loadTemplates();
    loadFolderShortcuts();
};
