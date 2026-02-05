const axios = require('axios');

const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME, POWER_AUTOMATE_URL } = process.env;
const FILE_PATH = 'data/banco-ferias.json';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Apenas POST permitido');

    const novaFerias = { ...req.body, id: Date.now() };

    try {
        // --- PARTE 1: PERSISTÊNCIA NO GITHUB ---
        const ghUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        
        let sha;
        let content = [];
        
        try {
            const { data } = await axios.get(ghUrl, { headers: { Authorization: `token ${GITHUB_TOKEN}` }});
            sha = data.sha;
            content = JSON.parse(Buffer.from(data.content, 'base64').toString());
        } catch (e) { /* Arquivo novo */ }

        content.push(novaFerias);
        const updatedContent = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');

        await axios.put(ghUrl, {
            message: `Agendamento: ${novaFerias.nome}`,
            content: updatedContent,
            sha: sha
        }, { headers: { Authorization: `token ${GITHUB_TOKEN}` }});


        // --- PARTE 2: SINCRONIZAÇÃO COM EXCEL (OFFICE 365) ---
        // Enviamos para um Flow do Power Automate que insere no Excel do OneDrive
        if (POWER_AUTOMATE_URL) {
            await axios.post(POWER_AUTOMATE_URL, novaFerias);
        }

        return res.status(201).json({ success: true, message: "Sincronizado em ambas bases!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Falha na sincronização" });
    }
}
