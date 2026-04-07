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
// Email
//------------------------------------------------
function loadTemplates() {
    templateList.innerHTML = "";
    const data = JSON.parse(localStorage.getItem("templates") || "[]");
    data.forEach((t,i)=>{
        templateList.innerHTML += `
            <div class="card">
                <b>${t.name}</b><br>
                <button onclick="navigator.clipboard.writeText(\`${t.text}\`)">Kopiér</button>
                <button onclick="deleteItem('templates',${i},loadTemplates)">Slet</button>
            </div>`;
    });
}
function addTemplate(){
    saveItem("templates",{name:templateName.value,text:templateInput.value});
    templateName.value=templateInput.value="";
    loadTemplates();
}

//------------------------------------------------
// File paths
//------------------------------------------------
function loadFolders(){
    folderList.innerHTML="";
    (JSON.parse(localStorage.getItem("folders")||[])).forEach((f,i)=>{
        folderList.innerHTML+=`
            <div class="card">
                <b>${f.name}</b><br>
                <button onclick="navigator.clipboard.writeText(\`${f.path}\`)">Kopiér sti</button>
                <button onclick="deleteItem('folders',${i},loadFolders)">Slet</button>
            </div>`;
    });
}
function addFolder(){
    saveItem("folders",{name:folderName.value,path:folderPath.value});
    folderName.value=folderPath.value="";
    loadFolders();
}

//------------------------------------------------
// Sticky notes
//------------------------------------------------
function loadNotes(){
    todoBoard.innerHTML="";
    (JSON.parse(localStorage.getItem("notes")||[])).forEach((n,i)=>createNote(n,i));
}

function addNote(){
    saveItem("notes",{title:"Overskrift",text:"",x:40,y:40,color:"yellow"});
    loadNotes();
}

function createNote(n,i){
    const d=document.createElement("div");
    d.className=`note ${n.color}`;
    d.style.left=n.x+"px";
    d.style.top=n.y+"px";
    d.innerHTML=`
        <h4 contenteditable oninput="updateNote(${i},'title',this.innerText)">${n.title}</h4>
        <textarea oninput="updateNote(${i},'text',this.value)">${n.text}</textarea>
        <select onchange="updateNote(${i},'color',this.value)">
            <option value="yellow">Gul</option>
            <option value="red">Rød</option>
            <option value="blue">Blå</option>
            <option value="purple">Lilla</option>
            <option value="green">Grøn</option>
        </select>
        <button onclick="deleteNote(${i})">Slet</button>
    `;
    d.querySelector("select").value=n.color;
    enableDrag(d,i);
    todoBoard.appendChild(d);
}

function updateNote(i,k,v){
    let n=JSON.parse(localStorage.getItem("notes"));
    n[i][k]=v;
    localStorage.setItem("notes",JSON.stringify(n));
    loadNotes();
}

function deleteNote(i){
    let n=JSON.parse(localStorage.getItem("notes"));
    n.splice(i,1);
    localStorage.setItem("notes",JSON.stringify(n));
    loadNotes();
}

function enableDrag(el,i){
    el.onmousedown=e=>{
        document.onmousemove=ev=>{
            el.style.left=ev.clientX-100+"px";
            el.style.top=ev.clientY-30+"px";
            let n=JSON.parse(localStorage.getItem("notes"));
            n[i].x=el.offsetLeft;
            n[i].y=el.offsetTop;
            localStorage.setItem("notes",JSON.stringify(n));
        };
        document.onmouseup=()=>document.onmousemove=null;
    };
}

//------------------------------------------------
// Dates
//------------------------------------------------
function loadDates(){
    datesList.innerHTML="";
    let d=JSON.parse(localStorage.getItem("dates")||[]);
    d.sort((a,b)=>new Date(a.dt)-new Date(b.dt));
    const today=new Date().toDateString();

    d.forEach((x,i)=>{
        const date=new Date(x.dt);
        const isToday=date.toDateString()===today;
        datesList.innerHTML+=`
            <div class="date-item ${isToday?'today':''}">
                <b>${x.t}</b><br>
                <small>
                    ${date.toLocaleDateString('da-DK',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
                    kl. ${date.toLocaleTimeString('da-DK',{hour:'2-digit',minute:'2-digit'})}
                </small><br>
                <button onclick="deleteItem('dates',${i},loadDates)">Slet</button>
            </div>`;
    });
}

function addDate(){
    if(!dateTitle.value||!dateValue.value)return;
    saveItem("dates",{t:dateTitle.value,dt:`${dateValue.value}T${timeValue.value||"00:00"}`});
    dateTitle.value=dateValue.value=timeValue.value="";
    loadDates();
}

//------------------------------------------------
// Helpers + init
//------------------------------------------------
function saveItem(k,v){
    let d=JSON.parse(localStorage.getItem(k)||[]);
    d.push(v);
    localStorage.setItem(k,JSON.stringify(d));
}
function deleteItem(k,i,cb){
    let d=JSON.parse(localStorage.getItem(k));
    d.splice(i,1);
    localStorage.setItem(k,JSON.stringify(d));
    cb();
}

window.onload=()=>{
    loadTemplates();
    loadFolders();
    loadNotes();
    loadDates();
};
