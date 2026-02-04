const cal = document.getElementById("cal");

function criarDias() {
  for (let i = 1; i <= 31; i++) {
    const d = document.createElement("div");
    d.className = "dia";
    d.innerText = i;
    cal.appendChild(d);
  }
}

async function carregarFerias() {
  const res = await fetch("/api/ferias");
  const ferias = await res.json();

  console.log("Férias:", ferias);
}

criarDias();
carregarFerias();
