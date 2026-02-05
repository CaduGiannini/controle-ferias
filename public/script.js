let currentDate = new Date();
let feriasData = [];

async function fetchFerias() {
    const res = await fetch('/api/ferias');
    feriasData = await res.json();
    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthDisplay = document.getElementById('monthDisplay');
    grid.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthDisplay.innerText = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentDate);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Espaços vazios
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'day-cell';
        grid.appendChild(empty);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        cell.innerHTML = `<span class="day-number">${day}</span>`;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Filtrar férias que caem neste dia
        const feriasNoDia = feriasData.filter(f => {
            return dateStr >= f.inicio && dateStr <= f.fim;
        });

        feriasNoDia.forEach(f => {
            const tag = document.createElement('div');
            tag.className = `vacation-tag ${f.cargo.toLowerCase()}`;
            tag.innerText = f.nome;
            tag.title = `${f.nome} (${f.cargo})`;
            cell.appendChild(tag);
        });

        grid.appendChild(cell);
    }
}

document.getElementById('feriasForm').onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
        nome: document.getElementById('nome').value,
        cargo: document.getElementById('cargo').value,
        inicio: document.getElementById('inicio').value,
        fim: document.getElementById('fim').value
    };

    const res = await fetch('/api/ferias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert('Férias agendadas!');
        fetchFerias();
    } else {
        const err = await res.json();
        alert(err.error);
    }
};

document.getElementById('prevMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

fetchFerias();
