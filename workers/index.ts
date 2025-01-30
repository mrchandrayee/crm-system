import { Client, ClientFormData } from '../src/types/client';

interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    try {
      if (path === '/api/clients' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM clients ORDER BY updatedAt DESC'
        ).all();
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (path === '/api/clients' && request.method === 'POST') {
        const client: ClientFormData = await request.json();
        const now = new Date().toISOString();
        
        const { success } = await env.DB.prepare(`
          INSERT INTO clients (
            firstName, lastName, email, phone, company, notes,
            lastInteraction, status, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          client.firstName,
          client.lastName,
          client.email,
          client.phone,
          client.company,
          client.notes,
          client.lastInteraction,
          client.status,
          now,
          now
        ).run();

        if (!success) throw new Error('Failed to create client');

        return new Response(JSON.stringify({ ...client, createdAt: now, updatedAt: now }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const clientIdMatch = path.match(/^\/api\/clients\/([^\/]+)$/);
      if (clientIdMatch) {
        const clientId = clientIdMatch[1];

        if (request.method === 'GET') {
          const { results } = await env.DB.prepare(
            'SELECT * FROM clients WHERE id = ?'
          ).bind(clientId).all();
          
          if (results.length === 0) {
            return new Response('Client not found', { status: 404 });
          }

          return new Response(JSON.stringify(results[0]), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (request.method === 'PUT') {
          const client: ClientFormData = await request.json();
          const now = new Date().toISOString();

          const { success } = await env.DB.prepare(`
            UPDATE clients SET
              firstName = ?, lastName = ?, email = ?, phone = ?,
              company = ?, notes = ?, lastInteraction = ?,
              status = ?, updatedAt = ?
            WHERE id = ?
          `).bind(
            client.firstName,
            client.lastName,
            client.email,
            client.phone,
            client.company,
            client.notes,
            client.lastInteraction,
            client.status,
            now,
            clientId
          ).run();

          if (!success) throw new Error('Failed to update client');

          return new Response(JSON.stringify({ ...client, id: clientId, updatedAt: now }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (request.method === 'DELETE') {
          const { success } = await env.DB.prepare(
            'DELETE FROM clients WHERE id = ?'
          ).bind(clientId).run();

          if (!success) throw new Error('Failed to delete client');

          return new Response(null, {
            status: 204,
            headers: corsHeaders,
          });
        }
      }

      const interactionMatch = path.match(/^\/api\/clients\/([^\/]+)\/interaction$/);
      if (interactionMatch && request.method === 'POST') {
        const clientId = interactionMatch[1];
        const { notes } = await request.json();
        const now = new Date().toISOString();

        const { success } = await env.DB.prepare(`
          UPDATE clients SET
            notes = ?, lastInteraction = ?, updatedAt = ?
          WHERE id = ?
        `).bind(notes, now, now, clientId).run();

        if (!success) throw new Error('Failed to update interaction');

        const { results } = await env.DB.prepare(
          'SELECT * FROM clients WHERE id = ?'
        ).bind(clientId).all();

        return new Response(JSON.stringify(results[0]), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return new Response(error.message, { status: 500 });
    }
  },
};
