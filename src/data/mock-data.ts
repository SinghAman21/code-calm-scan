import { ScanResult, Finding, Rule, HistoryEntry } from "@/types";

export const VULNERABLE_JS_CODE = `const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'users_db'
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    if (results.length > 0) {
      const token = Buffer.from(username + ':' + password).toString('base64');
      res.json({ token, user: results[0] });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// Get user profile
app.get('/api/user/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ' + req.params.id;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
    res.json(results[0]);
  });
});

// Update password
app.put('/api/user/password', (req, res) => {
  const { userId, newPassword } = req.body;
  const query = \`UPDATE users SET password = '\${newPassword}' WHERE id = \${userId}\`;
  db.query(query, (err) => {
    if (err) return res.status(500).send('Error');
    res.send('Password updated');
  });
});

app.listen(3000);`;

export const FIXED_JS_CODE = `const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, param, validationResult } = require('express-validator');
const app = express();

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const JWT_SECRET = process.env.JWT_SECRET;

// Login endpoint
app.post('/api/login', [
  body('username').isAlphanumeric().trim().escape(),
  body('password').isLength({ min: 8 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, password_hash FROM users WHERE username = ?',
      [username]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/user/:id', [
  param('id').isInt(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Profile fetch error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update password
app.put('/api/user/password', [
  body('userId').isInt(),
  body('newPassword').isStrongPassword(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, newPassword } = req.body;
  
  try {
    const hash = await bcrypt.hash(newPassword, 12);
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hash, userId]
    );
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(process.env.PORT || 3000);`;

export const MOCK_FINDINGS: Finding[] = [
  {
    id: "f1",
    title: "SQL Injection in Login Query",
    severity: "critical",
    category: "vulnerability",
    line: 18,
    endLine: 18,
    confidence: 98,
    description: "User input is directly interpolated into SQL query string without parameterization.",
    explanation: "String interpolation in SQL queries allows attackers to inject malicious SQL code. An attacker could bypass authentication by entering `' OR '1'='1` as username.",
    suggestion: "Use parameterized queries with prepared statements.",
    ruleId: "SQL-INJ-001",
  },
  {
    id: "f2",
    title: "Hardcoded Database Credentials",
    severity: "critical",
    category: "vulnerability",
    line: 9,
    endLine: 11,
    confidence: 99,
    description: "Database password is hardcoded in source code.",
    explanation: "Hardcoded credentials in source code can be exposed through version control, logs, or compiled artifacts. This is a severe security risk.",
    suggestion: "Use environment variables for all sensitive configuration.",
    ruleId: "SEC-CRED-001",
  },
  {
    id: "f3",
    title: "Weak Token Generation",
    severity: "high",
    category: "vulnerability",
    line: 26,
    confidence: 95,
    description: "Authentication token is created using base64 encoding of credentials.",
    explanation: "Base64 is an encoding, not encryption. Tokens created this way can be trivially decoded to reveal username and password.",
    suggestion: "Use JWT with a strong secret and proper expiration.",
    ruleId: "AUTH-TOK-001",
  },
  {
    id: "f4",
    title: "SQL Injection in User Profile Query",
    severity: "critical",
    category: "vulnerability",
    line: 35,
    confidence: 97,
    description: "User-supplied ID is concatenated directly into SQL query.",
    explanation: "String concatenation in SQL allows injection attacks. An attacker could extract entire database contents.",
    suggestion: "Use parameterized queries.",
    ruleId: "SQL-INJ-002",
  },
  {
    id: "f5",
    title: "Error Message Information Leak",
    severity: "medium",
    category: "bug",
    line: 22,
    confidence: 85,
    description: "Internal error messages are sent directly to the client.",
    explanation: "Exposing internal error details can reveal database structure, query patterns, or system information to attackers.",
    suggestion: "Return generic error messages to clients and log details server-side.",
    ruleId: "INFO-LEAK-001",
  },
  {
    id: "f6",
    title: "Missing Error Handler in Profile Route",
    severity: "medium",
    category: "bug",
    line: 37,
    endLine: 40,
    confidence: 90,
    description: "Response is sent even when an error occurs, potentially sending undefined data.",
    explanation: "When the query errors, the function continues to res.json(results[0]) which could send undefined or crash.",
    suggestion: "Add proper return after error handling.",
    ruleId: "ERR-HANDLE-001",
  },
  {
    id: "f7",
    title: "Plaintext Password Storage",
    severity: "critical",
    category: "vulnerability",
    line: 45,
    confidence: 96,
    description: "Passwords are stored in plaintext in the database.",
    explanation: "If the database is compromised, all user passwords are immediately exposed. This violates security best practices and regulations.",
    suggestion: "Hash passwords using bcrypt with a cost factor of 12+.",
    ruleId: "SEC-PASS-001",
  },
  {
    id: "f8",
    title: "No Input Validation",
    severity: "high",
    category: "code-smell",
    line: 16,
    confidence: 88,
    description: "No validation on request body parameters before use.",
    explanation: "Missing input validation can lead to unexpected behavior, injection attacks, and data corruption.",
    suggestion: "Add input validation using express-validator or similar library.",
    ruleId: "VALID-001",
  },
];

export const MOCK_SCAN_RESULT: ScanResult = {
  id: "scan-001",
  timestamp: new Date().toISOString(),
  language: "javascript",
  originalCode: VULNERABLE_JS_CODE,
  improvedCode: FIXED_JS_CODE,
  findings: MOCK_FINDINGS,
  stats: {
    critical: 4,
    high: 2,
    medium: 2,
    low: 0,
    total: 8,
    linesScanned: 52,
    scanDuration: 1.24,
  },
};

export const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: "scan-001",
    timestamp: "2026-04-13T10:30:00Z",
    language: "JavaScript",
    snippet: "express login endpoint with SQL queries...",
    stats: { critical: 4, high: 2, medium: 2, low: 0, total: 8, linesScanned: 52, scanDuration: 1.24 },
    status: "completed",
  },
  {
    id: "scan-002",
    timestamp: "2026-04-12T15:22:00Z",
    language: "Python",
    snippet: "Flask API with pickle deserialization...",
    stats: { critical: 2, high: 3, medium: 1, low: 1, total: 7, linesScanned: 87, scanDuration: 1.56 },
    status: "completed",
  },
  {
    id: "scan-003",
    timestamp: "2026-04-12T09:15:00Z",
    language: "TypeScript",
    snippet: "React component with dangerouslySetInnerHTML...",
    stats: { critical: 1, high: 1, medium: 3, low: 2, total: 7, linesScanned: 45, scanDuration: 0.89 },
    status: "completed",
  },
  {
    id: "scan-004",
    timestamp: "2026-04-11T18:45:00Z",
    language: "Go",
    snippet: "HTTP handler with command injection...",
    stats: { critical: 1, high: 2, medium: 0, low: 1, total: 4, linesScanned: 34, scanDuration: 0.67 },
    status: "completed",
  },
  {
    id: "scan-005",
    timestamp: "2026-04-11T14:10:00Z",
    language: "Java",
    snippet: "Spring Boot controller with LDAP query...",
    stats: { critical: 2, high: 1, medium: 2, low: 0, total: 5, linesScanned: 63, scanDuration: 1.12 },
    status: "failed",
  },
];

export const MOCK_RULES: Rule[] = [
  {
    id: "SQL-INJ-001",
    name: "SQL Injection Detection",
    category: "injection",
    severity: "critical",
    description: "Detects string concatenation or interpolation in SQL queries that may allow injection attacks.",
    unsafeExample: `const query = "SELECT * FROM users WHERE id = " + userId;`,
    safeExample: `const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);`,
  },
  {
    id: "SEC-CRED-001",
    name: "Hardcoded Credentials",
    category: "secrets",
    severity: "critical",
    description: "Detects passwords, API keys, and tokens hardcoded in source files.",
    unsafeExample: `const password = "admin123";`,
    safeExample: `const password = process.env.DB_PASSWORD;`,
  },
  {
    id: "AUTH-TOK-001",
    name: "Weak Token Generation",
    category: "auth",
    severity: "high",
    description: "Detects weak or predictable token generation methods.",
    unsafeExample: `const token = Buffer.from(user + ':' + pass).toString('base64');`,
    safeExample: `const token = jwt.sign({ userId }, secret, { expiresIn: '1h' });`,
  },
  {
    id: "XSS-001",
    name: "Cross-Site Scripting",
    category: "injection",
    severity: "high",
    description: "Detects unsafe rendering of user input in HTML context.",
    unsafeExample: `element.innerHTML = userInput;`,
    safeExample: `element.textContent = userInput;`,
  },
  {
    id: "CRYPTO-WEAK-001",
    name: "Weak Cryptographic Algorithm",
    category: "crypto",
    severity: "high",
    description: "Detects use of deprecated or weak cryptographic algorithms like MD5 or SHA-1.",
    unsafeExample: `const hash = crypto.createHash('md5').update(data).digest('hex');`,
    safeExample: `const hash = crypto.createHash('sha256').update(data).digest('hex');`,
  },
  {
    id: "API-UNSAFE-001",
    name: "Unsafe eval() Usage",
    category: "unsafe-apis",
    severity: "critical",
    description: "Detects use of eval() or similar dynamic code execution functions.",
    unsafeExample: `eval(userInput);`,
    safeExample: `// Use a safe parser or predefined operations\nconst result = safeParser.parse(userInput);`,
  },
  {
    id: "ERR-HANDLE-001",
    name: "Missing Error Handling",
    category: "quality",
    severity: "medium",
    description: "Detects missing try/catch blocks or unhandled promise rejections.",
    unsafeExample: `app.get('/api', (req, res) => {\n  const data = riskyOperation();\n  res.json(data);\n});`,
    safeExample: `app.get('/api', async (req, res) => {\n  try {\n    const data = await riskyOperation();\n    res.json(data);\n  } catch (err) {\n    res.status(500).json({ error: 'Internal error' });\n  }\n});`,
  },
  {
    id: "SEC-PASS-001",
    name: "Plaintext Password Storage",
    category: "auth",
    severity: "critical",
    description: "Detects storing user passwords without hashing.",
    unsafeExample: `db.query('INSERT INTO users (password) VALUES (?)', [password]);`,
    safeExample: `const hash = await bcrypt.hash(password, 12);\ndb.query('INSERT INTO users (password_hash) VALUES (?)', [hash]);`,
  },
];

export const SUPPORTED_LANGUAGES = [
  { id: "javascript", label: "JavaScript", icon: "JS" },
  { id: "typescript", label: "TypeScript", icon: "TS" },
  { id: "python", label: "Python", icon: "PY" },
  { id: "java", label: "Java", icon: "JV" },
  { id: "go", label: "Go", icon: "GO" },
  { id: "rust", label: "Rust", icon: "RS" },
  { id: "php", label: "PHP", icon: "PHP" },
  { id: "ruby", label: "Ruby", icon: "RB" },
  { id: "csharp", label: "C#", icon: "C#" },
  { id: "cpp", label: "C++", icon: "C++" },
] as const;
