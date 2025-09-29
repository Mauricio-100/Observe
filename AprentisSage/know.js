import db from '../database/db.js';

async function learn(command, action, details) {
  const sql = `
    INSERT INTO knowledge (input_phrase, action_type, action_payload) 
    VALUES (?, ?, ?)
  `;
  try {
    const [result] = await db.query(sql, [command.toLowerCase(), action, details]);
    return result.insertId;
  } catch (error) {
    console.error("Erreur lors de l'apprentissage:", error);
    return null;
  }
}

async function recall() {
  const sql = 'SELECT input_phrase as input, action_type, action_payload FROM knowledge';
  try {
    const [rows] = await db.query(sql);
    return rows.map(row => ({
      input: row.input,
      output: {
        action: row.action_type,
        command: row.action_payload, // Pour les commandes 'exec'
        query: row.action_payload   // Pour les commandes 'search'
      }
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération du savoir:", error);
    return [];
  }
}

export { learn, recall };
