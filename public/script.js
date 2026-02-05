// ... (mantenha o restante das funções de navegação)

document.getElementById('feriasForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const btn = e.target.querySelector('button');
    btn.innerText = 'Salvando...';
    btn.disabled = true;

    const payload = {
        nome: document.getElementById('nome').value,
        cargo: document.getElementById('cargo').value,
        inicio: document.getElementById('inicio').value,
        fim: document.getElementById('fim').value
    };

    try {
        const res = await fetch('/api/ferias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.ok) {
            alert('Férias agendadas com sucesso!');
            e.target.reset(); // Limpa o formulário
            await fetchFerias(); // Recarrega os dados e renderiza o calendário
        } else {
            alert('Erro: ' + result.error);
        }
    } catch (err) {
        alert('Erro de conexão com o servidor.');
    } finally {
        btn.innerText = 'Salvar Agendamento';
        btn.disabled = false;
    }
};
