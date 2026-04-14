lsof -iTCP:3004 -sTCP:LISTEN -n -P
COMMAND   PID USER FD   TYPE DEVICE SIZE/OFF NODE NAME
node    28283 aman 23u  IPv6 254576      0t0  TCP *:3004 (LISTEN)

kill 28283

ollama serve this will open  a  port where ollama will be runnig 
ollama run qwen2.5-coder:3b-instruct  using this for i5 8gb ram can imporve this based on your device specs

when i run ollama serve how will the backend to know it shall talk with that particualr model only?

Frontend → Your Next.js API → Ollama Server → Specific Model
       ↓              ↓             ↓           ↓
     POST /api/scan  `model: 'qwen2.5-coder:3b-instruct'`

What happens on first request:
Your backend sends: { model: 'qwen2.5-coder:3b-instruct', prompt: "..." }

Ollama server checks: "Is qwen2.5-coder:3b-instruct downloaded?"

If no → auto-downloads (~1.5GB)

If yes → loads into memory (~2.2GB RAM)

Runs inference → returns JSON response

ollama list


# Terminal 1: API server
ollama serve

# Terminal 2: Keep model warm
ollama run qwen2.5-coder:3b-instruct