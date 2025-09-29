// server.js

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
});
