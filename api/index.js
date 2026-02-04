import express from "express";
import cors from "cors";
import XLSX from "xlsx";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const filePath = path.join(process.cwd(), "data", "banco-ferias.xlsx");

function lerBanco() {
  if (!fs.existsSync(filePath)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(wb, ws, "Ferias");
    XLSX.writeFile(wb, filePath);
  }
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets["Ferias"];
  return XLSX.utils.sheet_to_json(ws);
}

function salvarBanco(dados) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(dados);
  XLSX.utils.book_append_sheet(wb, ws, "Ferias");
  XLSX.writeFile(wb, filePath);
}

app.get("/api/ferias", (req, res) => {
  res.json(lerBanco());
});

app.post("/api/ferias", (req, res) => {
  const dados = lerBanco();
  dados.push(req.body);
  salvarBanco(dados);
  res.json({ ok: true });
});

export default app;
