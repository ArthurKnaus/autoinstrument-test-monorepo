import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import {
  initializeDatabase,
  createSession,
  getSession,
  deleteSession,
  addMessage,
  getMessages,
} from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const anthropic = new Anthropic();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.json({ 
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString()
  });
});

// Create a new chat session
app.post('/api/chat/session', async (req, res) => {
  try {
    const sessionId = uuidv4();
    await createSession(sessionId);
    res.json({ sessionId });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get chat history for a session
app.get('/api/chat/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const history = await getMessages(sessionId);
    res.json({ history });
  } catch (error) {
    console.error('Error getting history:', error);
    res.status(500).json({ error: 'Failed to get history' });
  }
});

// Send a message and get AI response
app.post('/api/chat/message', async (req, res) => {
  const { sessionId, message } = req.body;
  
  if (!sessionId || !message) {
    return res.status(400).json({ error: 'sessionId and message are required' });
  }
  
  try {
    // Check if session exists, create if not
    let session = await getSession(sessionId);
    if (!session) {
      await createSession(sessionId);
    }
    
    // Add user message to database
    await addMessage(sessionId, 'user', message);
    
    // Get full history for context
    const history = await getMessages(sessionId);
    
    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'You are a helpful, friendly AI assistant. Keep responses concise but informative.',
      messages: history,
    });
    
    const assistantMessage = response.content[0].text;
    
    // Add assistant response to database
    await addMessage(sessionId, 'assistant', assistantMessage);
    
    // Get updated history
    const updatedHistory = await getMessages(sessionId);
    
    res.json({
      message: assistantMessage,
      history: updatedHistory,
    });
  } catch (error) {
    console.error('Anthropic API error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.message 
    });
  }
});

// Clear chat history for a session
app.delete('/api/chat/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await deleteSession(sessionId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
