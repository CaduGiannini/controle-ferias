import xlsx from "xlsx";
import path from "path";
import fs from "fs";

const filePath = path.join(process.cwd(), "data", "banco-ferias.xlsx");

export default function handler(req, res) {
  const workbook = fs.existsSync(filePath)
    ? xlsx.readFile(filePath)
    : xlsx.utils.book_new();

  const sheetName = workbook.SheetNames[0] || "Ferias";
  const sheet = workbook.Sheets[sheetName] || xlsx.utils.json_to_sheet([]);

  let dados = xlsx.utils.sheet_to_json(sheet);

  if (req.method === "POST") {
    const { nome, cargo, inicio, fim } = req.body;

    const hoje = new Date().toISOString().split("T")[0];
    if (inicio < hoje) {
      return res.status(400).json({ erro: "Não pode marcar férias no passado" });
    }

    dados.push({
      Nome: nome,
      Cargo: cargo,
      Inicio: inicio,
      Fim: fim
    });

    workbook.Sheets[sheetName] = xlsx.utils.json_to_sheet(dados);
    xlsx.writeFile(workbook, filePath);
  }

  res.status(200).json(dados);
}
