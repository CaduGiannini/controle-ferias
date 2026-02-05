const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// No Vercel, o único lugar com permissão de escrita é o /tmp
const FILE_PATH = path.join('/tmp', 'banco-ferias.xlsx');
const INITIAL_FILE = path.join(process.cwd(), 'data', 'banco-ferias.xlsx');

// Helper: Garante que o arquivo exista (copia do inicial para o /tmp se necessário)
const initExcel = () => {
    if (!fs.existsSync(FILE_PATH)) {
        if (fs.existsSync(INITIAL_FILE)) {
            fs.copyFileSync(INITIAL_FILE, FILE_PATH);
        } else {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet([]);
            XLSX.utils.book_append_sheet(wb, ws, "Ferias");
            XLSX.writeFile(wb, FILE_PATH);
        }
    }
};

export default function handler(req, res) {
    initExcel();
    const { method } = req;

    try {
        const workbook = XLSX.readFile(FILE_PATH);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(sheet);

        switch (method) {
            case 'GET':
                return res.status(200).json(data);

            case 'POST':
                const nova = req.body;
                nova.id = Date.now(); // ID único
                data.push(nova);
                
                const newWs = XLSX.utils.json_to_sheet(data);
                const newWb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(newWb, newWs, "Ferias");
                XLSX.writeFile(newWb, FILE_PATH);
                
                return res.status(201).json(nova);

            case 'DELETE':
                const { id } = req.query;
                data = data.filter(item => item.id != id);
                
                const delWs = XLSX.utils.json_to_sheet(data);
                const delWb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(delWb, delWs, "Ferias");
                XLSX.writeFile(delWb, FILE_PATH);
                
                return res.status(200).json({ message: "Excluído com sucesso" });

            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        return res.status(500).json({ error: "Erro ao processar Excel: " + error.message });
    }
}
