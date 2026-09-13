# BHOOMI-AI Run Commands

## 1. Backend Setup

Open PowerShell in the project root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt
```

If PowerShell blocks activation:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

## 2. Start Backend

Open Terminal 1:

```powershell
.\.venv\Scripts\Activate.ps1
Push-Location backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Pop-Location
```

Backend URLs:

```text
http://localhost:8000
http://localhost:8000/docs
http://localhost:8000/api/health
```

## 3. Frontend Setup

Open Terminal 2:

```powershell
Push-Location frontend
npm install
npm run dev
Pop-Location
```

Frontend URL:

```text
http://localhost:3000
```

Frontend with a custom backend URL:

```powershell
$env:NEXT_PUBLIC_API_URL = "http://localhost:8000"
Push-Location frontend
npm run dev
Pop-Location
```

## 4. Database Utility Setup

Use only when MongoDB environment variables are configured.

Create `database\.env`:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DATABASE=bhoomi_ai
```

Open Terminal 3:

```powershell
Push-Location database
npm install
node database.js
Pop-Location
```

## 5. Run Complete Project

Start each service in a separate PowerShell terminal.

Terminal 1:

```powershell
.\.venv\Scripts\Activate.ps1
Push-Location backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Pop-Location
```

Terminal 2:

```powershell
Push-Location frontend
npm run dev
Pop-Location
```

Open:

```text
http://localhost:3000
```

## 6. Test Backend

```powershell
Invoke-WebRequest http://localhost:8000/api/health
```

```powershell
Invoke-RestMethod http://localhost:8000/api/projects
```

## 7. Build Frontend

```powershell
Push-Location frontend
npm run build
npm run start
Pop-Location
```

Production frontend URL:

```text
http://localhost:3000
```

## 8. Stop Services

Press:

```text
Ctrl + C
```

## 9. Common Fixes

Clear Next.js cache:

```powershell
Remove-Item -Recurse -Force frontend\.next
```

Reinstall frontend dependencies:

```powershell
Remove-Item -Recurse -Force frontend\node_modules
Remove-Item -Force frontend\package-lock.json -ErrorAction SilentlyContinue
Push-Location frontend
npm install
Pop-Location
```

Check Python version:

```powershell
python --version
```

Check Node.js and npm versions:

```powershell
node --version
npm --version
```
