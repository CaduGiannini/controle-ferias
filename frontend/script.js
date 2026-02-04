const calendar = document.getElementById("calendar");
const mesAno = document.getElementById("mesAno");
let dataAtual = new Date();

const cores = {
  Analista: "Analista",
  Coordenador: "Coordenador",
  Gerente: "Gerente"
};

async function carregarFerias() {
  const res = await fetch("/api/ferias");
  return res.json();
}

function renderCalendar(ferias) {
  calendar.innerHTML = "";
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();

  mesAno.innerText = dataAtual.toLocaleString("pt-br", { month: "long", year: "numeric" });

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  for (let i = 0; i < primeiroDia; i++) {
    calendar.innerHTML += "<div></div>";
  }

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const dataStr = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    const cell = document.createElement("div");
    cell.className = "day";
    cell.innerHTML = `<strong>${dia}</strong>`;

    ferias.forEach(f => {
      if (dataStr >= f.inicio && dataStr <= f.fim) {
        cell.classList.add(cores[f.cargo]);
        cell.innerHTML += `<div>${f.nome}</div>`;
      }
    });

    calendar.appendChild(cell);
  }
}

async function atualizar() {
  const ferias = await carregarFerias();
  renderCalendar(ferias);
}

document.getElementById("prev").onclick = () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  atualizar();
};

document.getElementById("next").onclick = () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  atualizar();
};

document.getElementById("form").onsubmit = async e => {
  e.preventDefault();

  const inicio = document.getElementById("inicio").value;
  if (inicio < new Date().toISOString().split("T")[0]) {
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

  atualizar();
};

atualizar();
