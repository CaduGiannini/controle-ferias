const calendario = document.getElementById("calendario");

// gerar janeiro simples (exemplo)
function criarCalendario() {
  const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

  diasSemana.forEach(d => {
    const div = document.createElement("div");
    div.className = "dia titulo";
    div.innerText = d;
    calendario.appendChild(div);
  });

  for (let dia = 1; dia <= 31; dia++) {
    const div = document.createElement("div");
    div.className = "dia";
    div.innerText = dia;
    calendario.appendChild(div);
  }
}

criarCalendario();
