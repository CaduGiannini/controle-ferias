const calendario = document.getElementById("calendario");

const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

function criarCalendario() {
  calendario.innerHTML = "";

  diasSemana.forEach(dia => {
    const div = document.createElement("div");
    div.className = "dia titulo";
    div.innerText = dia;
    calendario.appendChild(div);
  });

  for (let dia = 1; dia <= 31; dia++) {
    const div = document.createElement("div");
    div.className = "dia";
    div.innerText = dia;
    div.dataset.dia = dia;
    calendario.appendChild(div);
  }
}

async function carregarFerias() {
  const response = await fetch("/api/ferias");
  const ferias = await response.json();

  ferias.forEach(item => {
    const inicio = new Date(item.Inicio);
    const fim = new Date(item.Fim);

    for (let d = inicio.getDate(); d <= fim.getDate(); d++) {
      const celula = document.querySelector(`[data-dia="${d}"]`);
      if (celula) {
        celula.classList.add(item.Cargo);
        celula.innerHTML += `<br>${item.Nome}`;
      }
    }
  });
}

criarCalendario();
carregarFerias();
