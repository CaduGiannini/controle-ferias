import express from "express";
import cors from "cors";
import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

console.log("Arquivo index.js iniciado");

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, "../data/banco-ferias.xlsx");

console.log("Caminho do Excel:", FILE_PATH);

/* ROTA TESTE */
app.get("/", (req, res) => {
  res.send("API Controle de Férias rodando");
});

/* LISTAR FÉRIAS */
app.get("/ferias", (req, res) => {
  try {
    const workbook = XLSX.readFile(FILE_PATH);
    const sheet = workbook.Sheets["BANCO_DE_DADOS"];
    const data = XLSX.utils.sheet_to_json(sheet);
    res.json(data);
  } catch (err) {
    console.error("Erro ao ler Excel:", err.message);
    res.status(500).json({ erro: err.message });
  }
});

/* CRIAR FÉRIAS */
app.post("/ferias", (req, res) => {
  try {
    const { nome, cargo, inicio, fim } = req.body;

    const workbook = XLSX.readFile(FILE_PATH);
    const sheet = workbook.Sheets["BANCO_DE_DADOS"];
    const data = XLSX.utils.sheet_to_json(sheet);

    const novo = {
      id: data.length + 1,
      nome,
      cargo,
      inicio,
      fim
    };

    data.push(novo);

    const novaSheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets["BANCO_DE_DADOS"] = novaSheet;
    XLSX.writeFile(workbook, FILE_PATH);

    res.json(novo);
  } catch (err) {
    console.error("Erro ao salvar:", err.message);
    res.status(500).json({ erro: err.message });
  }
});

/* START DO SERVIDOR */
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
