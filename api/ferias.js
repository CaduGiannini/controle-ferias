const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const FILE_PATH = path.join(process.cwd(), 'data', 'banco-ferias.xlsx');

// Helper para ler o Excel
const readExcel = () => {
    if (!fs.existsSync(FILE_PATH)) return [];
    const workbook = XLSX.readFile(FILE_PATH);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
};

// Helper para escrever no Excel
const writeExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ferias");
    XLSX.writeFile(wb, FILE_PATH);
};

export default function handler(req, res) {
    const { method } = req;
    let data = readExcel();

    switch (method) {
        case 'GET':
            return res.status(200).json(data);

        case 'POST':
            const nova = req.body;
            // Validação de Data
            if (new Date(nova.inicio) < new Date().setHours(0,0,0,0)) {
                return res.status(400).json({ error: "Data retroativa não permitida." });
            }
            nova.id = data.length > 0 ? Math.max(...data.map(f => f.id)) + 1 : 1;
            data.push(nova);
            writeExcel(data);
            return res.status(201).json(nova);

        case 'DELETE':
            const { id } = req.query;
            data = data.filter(f => f.id != id);
            writeExcel(data);
            return res.status(200).json({ message: "Excluído" });

        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
