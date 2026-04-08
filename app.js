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
// Dates – KORREKT DAG-LOGIK (ingen tid)
//------------------------------------------------
function loadDates() {
    datesList.innerHTML = "";

    const today = new Date();
    today.setHours(0,0,0,0);

    const dates = JSON.parse(localStorage.getItem("dates") || []);
    dates.sort((a,b)=> new Date(a.date) - new Date(b.date));

    dates.forEach((d,i) => {
        const eventDate = new Date(d.date);
        eventDate.setHours(0,0,0,0);

        const diffDays = Math.round(
            (eventDate - today) / (1000*60*60*24)
        );

        let color =
            diffDays <= 3 ? "red" :
            diffDays <= 7 ? "yellow" :
            "green";

        let status =
            diffDays === 0 ? "I dag" :
            diffDays > 0 ? `Om ${diffDays} dage` :
            "Forfalden";

        const div = document.createElement("div");
        div.className = `date-item ${color}`;
        div.innerHTML = `
            <b>${d.title}</b><br>
            <small>
                ${eventDate.toLocaleDateString("da-DK", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })}
            </small><br>
            <small>${status}</small><br>
            <button onclick="removeItem('dates',${i},loadDates)">Delete</button>
        `;
        datesList.appendChild(div);
    });
}

function addDate() {
    if (!dateTitle.value || !dateValue.value) return;

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
    loadDates();
};
