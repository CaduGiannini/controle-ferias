import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "banco-ferias.xlsx");

function readData() {
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws);
}

function writeData(data) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Ferias");
  XLSX.writeFile(wb, filePath);
}

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(readData());
  }

  if (req.method === "POST") {
    const data = readData();
    const body = req.body;

    data.push({
      id: Date.now(),
      nome: body.nome,
      cargo: body.cargo,
      inicio: body.inicio,
      fim: body.fim
    });

    writeData(data);
    return res.status(201).json({ ok: true });
  }

  res.status(405).end();
}
