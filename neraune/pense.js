import { recall } from "../AprentisSage/know.js";
import stringSimilarity from 'string-similarity';

async function pense(userInput) {
  const knowledge = await recall();
  if (knowledge.length === 0) {
    return `search:${userInput}`; // Si la mémoire est vide, on cherche par défaut
  }
  
  const inputs = knowledge.map(k => k.input);
  const matches = stringSimilarity.findBestMatch(userInput.toLowerCase(), inputs);

  if (matches.bestMatch.rating > 0.65) { // Seuil de confiance
    const bestMatch = knowledge.find(k => k.input === matches.bestMatch.target);
    const { action, command, query } = bestMatch.output;
    
    return `${action}:${command || query}`;
  }

  // Si pas de correspondance claire, on suppose que c'est une recherche
  return `search:${userInput}`;
}

export { pense };
