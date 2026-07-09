# CodeLingo Admin Panel Guide

## Access Admin Routes

All admin endpoints require the `ADMIN_PASSWORD` environment variable.

**Method 1: Header**
```bash
curl -H "x-admin-key: YOUR_ADMIN_PASSWORD" https://api.codelingo.com/api/admin/stats
```

**Method 2: Query Parameter**
```bash
curl https://api.codelingo.com/api/admin/stats?admin_key=YOUR_ADMIN_PASSWORD
```

---

## Admin Endpoints

### 📊 Get Platform Statistics
```bash
GET /api/admin/stats?admin_key=PASSWORD
```

**Response:**
```json
{
  "verified_users": 150,
  "total_lessons": 25,
  "lesson_completions": 450
}
```

---

### 📚 Get All Lessons
```bash
GET /api/admin/lessons?admin_key=PASSWORD
```

**Response:**
```json
[
  {
    "id": 1,
    "lesson_key": "italian-greetings",
    "title": "Italian Basics: Greetings",
    "description": "Learn how to greet people in Italian",
    "category": "language",
    "level": 1,
    "xp_reward": 20
  }
]
```

---

### ➕ Create New Lesson
```bash
POST /api/admin/lessons?admin_key=PASSWORD
Content-Type: application/json

{
  "lesson_key": "spanish-basics",
  "title": "Spanish: Greetings",
  "description": "Learn Spanish greetings",
  "category": "language",
  "level": 1,
  "xp_reward": 20
}
```

**Response:**
```json
{
  "id": 26,
  "lesson_key": "spanish-basics",
  "title": "Spanish: Greetings",
  ...
}
```

---

### ✏️ Update Lesson
```bash
PUT /api/admin/lessons/1?admin_key=PASSWORD
Content-Type: application/json

{
  "title": "Updated Title",
  "xp_reward": 30
}
```

---

### 🗑️ Delete Lesson
```bash
DELETE /api/admin/lessons/1?admin_key=PASSWORD
```

---

### 📖 Add Lesson Step
```bash
POST /api/admin/lessons/1/steps?admin_key=PASSWORD
Content-Type: application/json

{
  "step_number": 5,
  "content": "Practice your skills with real examples"
}
```

---

## Example Workflow: Add a New Lesson

### Step 1: Create Lesson
```bash
curl -X POST http://localhost:5000/api/admin/lessons?admin_key=your_key \
  -H "Content-Type: application/json" \
  -d '{
    "lesson_key": "rust-basics",
    "title": "Rust: Getting Started",
    "description": "Introduction to Rust programming",
    "category": "code",
    "level": 1,
    "xp_reward": 25
  }'
```

### Step 2: Add Steps to Lesson
```bash
# Get lesson ID from response (e.g., 27)
curl -X POST http://localhost:5000/api/admin/lessons/27/steps?admin_key=your_key \
  -H "Content-Type: application/json" \
  -d '{
    "step_number": 1,
    "content": "What is Rust? A systems programming language focused on safety."
  }'

curl -X POST http://localhost:5000/api/admin/lessons/27/steps?admin_key=your_key \
  -H "Content-Type: application/json" \
  -d '{
    "step_number": 2,
    "content": "Install Rust: Download from rust-lang.org"
  }'
```

### Step 3: Verify
```bash
curl http://localhost:5000/api/lessons/27
```

---

## Building an Admin Dashboard (Frontend)

Example HTML for admin dashboard:

```html
<!DOCTYPE html>
<html>
<head>
  <title>CodeLingo Admin Panel</title>
  <style>
    body { font-family: Arial; margin: 20px; }
    .card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>📊 CodeLingo Admin Panel</h1>
  
  <div class="card">
    <h2>Platform Stats</h2>
    <p>Users: <strong id="users">-</strong></p>
    <p>Lessons: <strong id="lessons">-</strong></p>
    <p>Completions: <strong id="completions">-</strong></p>
  </div>

  <div class="card">
    <h2>Create New Lesson</h2>
    <input type="text" id="title" placeholder="Lesson Title" />
    <input type="text" id="category" placeholder="Category (language/code)" />
    <input type="number" id="level" placeholder="Level" />
    <button onclick="createLesson()">Create</button>
  </div>

  <script>
    const ADMIN_KEY = 'YOUR_ADMIN_KEY';
    const API = 'http://localhost:5000/api';

    async function getStats() {
      const res = await fetch(`${API}/admin/stats?admin_key=${ADMIN_KEY}`);
      const data = await res.json();
      document.getElementById('users').textContent = data.verified_users;
      document.getElementById('lessons').textContent = data.total_lessons;
      document.getElementById('completions').textContent = data.lesson_completions;
    }

    async function createLesson() {
      const title = document.getElementById('title').value;
      const category = document.getElementById('category').value;
      const level = document.getElementById('level').value;

      const res = await fetch(`${API}/admin/lessons?admin_key=${ADMIN_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_key: title.toLowerCase().replace(/\s/g, '-'),
          title,
          category,
          level: parseInt(level)
        })
      });
      const data = await res.json();
      alert('Lesson created! ID: ' + data.id);
      getStats();
    }

    // Load stats on page load
    getStats();
  </script>
</body>
</html>
```

---

## Security Tips

⚠️ **Important:**

1. **Change default admin password** in production
2. **Use HTTPS only** in production
3. **Rotate admin keys** periodically
4. **Log admin activities** for audit trails
5. **Limit admin endpoints** by IP address if possible
6. **Never commit** admin password to git

---

## Troubleshooting

**"Unauthorized" error?**
- Check `ADMIN_PASSWORD` env var is set correctly
- Make sure you're passing admin_key in header or query param

**Can't create lessons?**
- Verify database is running
- Check PostgreSQL connection in logs
- Run `psql codelingo -c "SELECT * FROM lessons;"` to verify DB

**Getting 404 on admin routes?**
- Ensure you're using `/api/admin/` prefix
- Check your API URL is correct
