import fetch from 'node-fetch';

async function searchQuery(query) {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.AbstractText) {
      return data.AbstractText;
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      return data.RelatedTopics[0].Text;
    }
    return "Je n'ai trouvé aucune information pertinente.";
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    return "Désolé, une erreur est survenue pendant la recherche.";
  }
}

export { searchQuery };
