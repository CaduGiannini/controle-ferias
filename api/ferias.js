import xlsx from "xlsx";
import path from "path";
import fs from "fs";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "data", "banco-ferias.xlsx");

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ erro: "Arquivo Excel não encontrado" });
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const dados = xlsx.utils.sheet_to_json(sheet);

    res.status(200).json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}
