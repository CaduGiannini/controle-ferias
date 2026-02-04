import xlsx from "xlsx";
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "data", "banco-ferias.xlsx");

    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const dados = xlsx.utils.sheet_to_json(sheet);

    res.status(200).json(dados);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
