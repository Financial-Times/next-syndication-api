'use strict';

// =============================================================================
// WHY THIS FILE EXISTS: The real app (server/app.js) cannot start without
// FT-internal services: session-next.ft.com, Salesforce, AWS SQS, Elasticsearch,
// and SSL-enabled PostgreSQL. It crashes on startup with different errors 
// depending on which service it tries to connect to first.
// This wrapper removes those infrastructure dependencies while keeping the database layer IDENTICAL to production.
//
// WHAT IS FROM THE ORIGINAL REPO (unchanged):
//   - server/middleware/access-control.js  → imported directly (CORS regex)
//   - massive (npm package)                → same db.query() used in production
//   - pg-connection-string (npm package)   → same connection parsing
//
// WHAT THIS FILE ADDS (infrastructure only, not security-relevant):
//   - Express server setup (the real app uses @financial-times/n-express)
//   - Database connection without SSL (production uses SSL)
//   - Stubbed res.locals (production populates these via auth middleware)
//
// HOW TO USE THIS FILE:
//   1. Ensure you have a local PostgreSQL database running with the same schema as production.
//   2. Run the app by executing: 
//       `# Start with environment pointing at local PostgreSQL        
//        DATABASE_URL="postgresql://postgres@127.0.0.1:5432/syndication" \
//        NODE_ENV=development \
//        node scripts/minimum-app.js`
//   3. The server will start on http://localhost:3255
// =============================================================================

process.env.TZ = 'UTC';
process.env.NODE_ENV = 'development';
process.env.DATABASE_URL = 'postgresql://postgres:testpass@127.0.0.1:5432/syndication';

const express = require('express');
const cookieParser = require('cookie-parser');
const massive = require('massive');
const pgConn = require('pg-connection-string');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ORIGINAL FILE: server/middleware/access-control.js (imported directly, not copied)
const accessControl = require('../server/middleware/access-control');
app.use(accessControl);

let dbInstance = null;

async function getDb() {
    if (!dbInstance) {
        const conn = pgConn.parse(process.env.DATABASE_URL);
        // Production uses: ssl: { rejectUnauthorized: false }
        // Local PostgreSQL doesn't have SSL, so we omit it
        dbInstance = await massive(conn);
    }
    return dbInstance;
}

// Stub the res.locals that auth middleware would normally populate.
// In production, these are set by: validateSession, isSyndicationUser,
// getSyndicationLicenceForUser, getContractByIdFromSession, getUserProfile
app.use(async (req, res, next) => {
    try {
        res.locals.$DB = await getDb();
        res.locals.userUuid = 'test-user-uuid';
        res.locals.allowed = { spanish_content: true, spanish_weekend: true };
        res.locals.contract = { contract_id: 'TEST-CONTRACT-001', allowed: res.locals.allowed };
        next();
    } catch (err) {
        next(err);
    }
});

// --------------------------------------------------------------------------
// VULNERABLE ENDPOINT: /syndication/translations
//
// PURPOSE: Prove that the SQL construction in server/controllers/translations.js
// is vulnerable to injection via the query, offset, and limit
// parameters when executed against a real PostgreSQL database.
//
// The SQL construction below is copied VERBATIM from: server/controllers/translations.js,
//
// Original source (translations.js) reads query params:
//   let { query: { limit = 50, offset = 0, query, ... } } = req;
//
// Original source (translations.js) builds the query string:
//   if (typeof query === 'string' && query.trim().length) {
//       getQuery += `query => $text$${query.trim()}$text$`;
//   }
//
// Original source (translations.js) appends offset/limit:
//   getQuery = `${getQuery}${getQuery.length ? ',' : ''}
//   _offset => ${offset}::integer,
//   _limit => ${limit}::integer`;
//
// Original source (translations.js) executes:
//   const items = await db.query(`SELECT * FROM syndication.search_content_es(${getQuery})`);
// --------------------------------------------------------------------------
app.get('/syndication/translations', async (req, res) => {
    const db = res.locals.$DB;

    // translations.js — destructured from req.query
    const { query, offset = 0, limit = 50 } = req.query;

    try {
        // translations.js — VERBATIM
        let getQuery = '';
        if (typeof query === 'string' && query.trim().length) {
            getQuery += `query => $text$${query.trim()}$text$`;
        }

        // translations.js — VERBATIM
        getQuery = `${getQuery}${getQuery.length ? ',' : ''}_offset => ${offset}::integer,_limit => ${limit}::integer`;

        // translations.js — VERBATIM
        const sqlStatement = `SELECT * FROM syndication.search_content_es(${getQuery})`;
        // eslint-disable-next-line no-console
        console.log('\n[SQL EXECUTED]:', sqlStatement, '\n');
        const items = await db.query(sqlStatement);

        // translations.js — VERBATIM
        const [{ search_content_total_es }] = await db.query(
            `SELECT * FROM syndication.search_content_total_es(${typeof query === 'string' && query.trim().length
                ? `query => $text$${query.trim()}$text$`
                : ''
            })`
        );
        const total = parseInt(search_content_total_es, 10);

        res.json({ items, total });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('\n[SQL ERROR]:', err.message, '\n');
        res.status(500).json({ error: err.message });
    }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res) => {
    // eslint-disable-next-line no-console
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
});

const PORT = 3255;
app.listen(PORT, () => {
	/* eslint-disable no-console */
    console.log('\n=== SQL Injection PoC — next-syndication-api ===');
    console.log(`Listening on http://localhost:${PORT}`);
    console.log('\nEndpoints:');
    console.log('  GET /health');
    console.log('  GET /syndication/translations?lang=es');
    console.log('  GET /syndication/translations?lang=es&limit=INJECTION');
    console.log(`\nDatabase: ${process.env.DATABASE_URL}\n`);
	/* eslint-enable no-console */
});
