import knex from 'knex';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure data directory exists
const dataDir = join(__dirname, '..', 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Initialize Knex
const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: join(dataDir, 'chat.sqlite'),
  },
  useNullAsDefault: true,
});

// Run migrations on startup
export async function initializeDatabase() {
  // Check if tables exist
  const hasSessionsTable = await db.schema.hasTable('sessions');
  
  if (!hasSessionsTable) {
    console.log('📦 Creating database tables...');
    
    // Create sessions table
    await db.schema.createTable('sessions', (table) => {
      table.string('id').primary();
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });

    // Create messages table
    await db.schema.createTable('messages', (table) => {
      table.increments('id').primary();
      table.string('session_id').notNullable();
      table.string('role').notNullable();
      table.text('content').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
      
      table.foreign('session_id').references('id').inTable('sessions').onDelete('CASCADE');
      table.index('session_id');
    });
    
    console.log('✅ Database tables created');
  }
}

// Session operations
export async function createSession(sessionId) {
  await db('sessions').insert({ id: sessionId });
  return sessionId;
}

export async function getSession(sessionId) {
  return db('sessions').where({ id: sessionId }).first();
}

export async function deleteSession(sessionId) {
  await db('sessions').where({ id: sessionId }).del();
}

// Message operations
export async function addMessage(sessionId, role, content) {
  const [id] = await db('messages').insert({
    session_id: sessionId,
    role,
    content,
  });
  return id;
}

export async function getMessages(sessionId) {
  return db('messages')
    .where({ session_id: sessionId })
    .orderBy('id', 'asc')
    .select('role', 'content');
}

export async function deleteMessages(sessionId) {
  await db('messages').where({ session_id: sessionId }).del();
}

export default db;
