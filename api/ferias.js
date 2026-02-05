const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Garante o caminho absoluto independente de onde o processo inicia
const FILE_PATH = path.join(process.cwd(), 'data', 'banco-ferias.xlsx');

const readExcel = () => {
    try {
        if (!fs.existsSync(FILE_PATH)) return [];
        const workbook = XLSX.readFile(FILE_PATH);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(sheet);
    } catch (e) {
        console.error("Erro na leitura:", e);
        return [];
    }
};

const writeExcel = (data) => {
    try {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Ferias");
        
        // Verifica se a pasta data existe, se não, cria
        const dir = path.dirname(FILE_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        XLSX.writeFile(wb, FILE_PATH);
        return true;
    } catch (e) {
        console.error("Erro na escrita:", e);
        return false;
    }
};

export default function handler(req, res) {
    // Importante para o Vercel aceitar JSON no body
    const { method } = req;
    let data = readExcel();

    if (method === 'GET') {
        return res.status(200).json(data);
    } 

    if (method === 'POST') {
        const novaFerias = req.body;

        // Validação de Datas
        const hoje = new Date().toISOString().split('T')[0];
        if (novaFerias.inicio < hoje) {
            return res.status(400).json({ error: "Não é possível marcar férias retroativas." });
        }
        if (novaFerias.fim < novaFerias.inicio) {
            return res.status(400).json({ error: "Data de fim deve ser posterior ao início." });
        }

        novaFerias.id = Date.now(); // ID único baseado em timestamp
        data.push(novaFerias);
        
        const sucesso = writeExcel(data);
        if (sucesso) {
            return res.status(201).json(novaFerias);
        } else {
            return res.status(500).json({ error: "Erro ao salvar no Excel." });
        }
    }

    res.status(405).json({ error: "Método não permitido" });
}
