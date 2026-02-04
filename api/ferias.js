const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

let date = new Date();

const cargoClass = {
  "AP1": "AP1",
  "AP2": "AP2",
  "Analista": "Analista",
  "Coordenação": "Coordenação"
};

async function load() {
  const res = await fetch("/api/ferias");
  const ferias = await res.json();
  renderCalendar(ferias);
}

function renderCalendar(ferias) {
  calendar.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();

  monthYear.textContent = date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= days; d++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";

    const current = new Date(year, month, d);
    if (current < new Date().setHours(0,0,0,0)) {
      dayEl.classList.add("disabled");
    }

    ferias.forEach(f => {
      if (current >= new Date(f.inicio) && current <= new Date(f.fim)) {
        dayEl.classList.add(cargoClass[f.cargo]);
        dayEl.innerHTML = `<strong>${d}</strong><br>${f.nome}`;
      }
    });

    if (!dayEl.innerHTML) dayEl.textContent = d;
    calendar.appendChild(dayEl);
  }
}

document.getElementById("prev").onclick = () => {
  date.setMonth(date.getMonth() - 1);
  load();
};

document.getElementById("next").onclick = () => {
  date.setMonth(date.getMonth() + 1);
  load();
};

document.getElementById("form").onsubmit = async e => {
  e.preventDefault();

  const inicio = document.getElementById("inicio").value;
  if (new Date(inicio) < new Date().setHours(0,0,0,0)) {
    alert("Não é permitido marcar férias no passado");
    return;
  }

  await fetch("/api/ferias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: nome.value,
      cargo: cargo.value,
      inicio,
      fim: fim.value
    })
  });

  e.target.reset();
  load();
};

load();
