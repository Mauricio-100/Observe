import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { pense } from './neraune/pense.js';
import { searchQuery } from './engine/search.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);

  socket.emit('server_instruction', {
    action: 'display_message',
    payload: { text: "🐉 Connexion au cerveau de Dragon réussie.", color: "green" }
  });

  socket.on('user_prompt', async (prompt) => {
    console.log(`[${socket.id}] Demande: ${prompt}`);

    const decision = await pense(prompt);
    
    if (decision.startsWith('exec:')) {
      const cmd = decision.substring(5);
      socket.emit('server_instruction', {
        action: 'display_message',
        payload: { text: `[Action simulée] Je devrais exécuter la commande : ${cmd}`, color: "yellow" }
      });
    } else if (decision.startsWith('search:')) {
      const query = decision.substring(7);
      const result = await searchQuery(query);
      socket.emit('server_instruction', {
        action: 'display_message',
        payload: { text: result, color: "cyan" }
      });
    } else {
      socket.emit('server_instruction', {
        action: 'display_message',
        payload: { text: "Je ne suis pas certain de ce que je dois faire.", color: "red" }
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Le cerveau de Dragon écoute sur http://localhost:${PORT}`);
});```

### Prochaines Étapes

1.  **Créez** toute cette structure de dossiers et de fichiers.
2.  **Copiez-collez** le code dans les fichiers correspondants.
3.  **Placez votre certificat `ca.pem`** dans le dossier `certs`.
4.  **Mettez à jour le fichier `.env`** avec votre vrai mot de passe.
5.  **Exécutez `npm install`** pour télécharger toutes les dépendances.
6.  **Lancez le serveur** avec la commande `npm run dev`.

Votre serveur Dragon est maintenant complet, structuré et prêt à fonctionner.
