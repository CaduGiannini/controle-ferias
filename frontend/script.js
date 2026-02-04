const calendario = document.getElementById("calendario");
const mesAno = document.getElementById("mesAno");

const hoje = new Date();
let mesAtual = hoje.getMonth();
let anoAtual = hoje.getFullYear();

const diasSemana = ["DOM","SEG","TER","QUA","QUI","SEX","SAB"];

function renderCalendario() {
  calendario.innerHTML = "";

  mesAno.innerText = new Date(anoAtual, mesAtual)
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  diasSemana.forEach(d => {
    const div = document.createElement("div");
    div.className = "dia titulo";
    div.innerText = d;
    calendario.appendChild(div);
  });

  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();

  for (let i = 0; i < primeiroDia; i++) {
    calendario.appendChild(document.createElement("div"));
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const div = document.createElement("div");
    div.className = "dia";
    div.dataset.data = `${anoAtual}-${String(mesAtual+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
    div.innerText = dia;
    calendario.appendChild(div);
  }

  pintarFerias();
}

document.getElementById("prev").onclick = () => {
  mesAtual--;
  if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
  renderCalendario();
};

document.getElementById("next").onclick = () => {
  mesAtual++;
  if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
  renderCalendario();
};

async function pintarFerias() {
  const res = await fetch("/api/ferias");
  const ferias = await res.json();

  ferias.forEach(f => {
    const inicio = new Date(f.Inicio);
    const fim = new Date(f.Fim);

    document.querySelectorAll(".dia").forEach(cel => {
      const data = new Date(cel.dataset.data);
      if (data >= inicio && data <= fim) {
        cel.classList.add(f.Cargo);
        cel.innerHTML += `<br>${f.Nome}`;
      }
    });
  });
}

renderCalendario();
