# 🖥️ Backend Setup - Passo a Passo

## 📋 Pré-requisitos
- Node.js instalado (versão 16+)
- Git instalado
- Editor de código (VS Code recomendado)

## 🚀 Passo 1: Configurar o Backend

### 1.1 Navegar para a pasta backend
```bash
cd projeto-iot/backend
```

### 1.2 Instalar dependências
```bash
npm install express cors dotenv socket.io
npm install -D nodemon
```

### 1.3 Configurar package.json
O arquivo já está configurado com:
- Scripts de desenvolvimento (`npm run dev`)
- Dependências necessárias
- Configuração de módulos ES6

## 🔧 Passo 2: Configurar Variáveis de Ambiente

### 2.1 Criar arquivo .env
```bash
# Configurações do servidor
PORT=3000
NODE_ENV=development

# Configurações de rede
ESP32_IP=192.168.1.100

# Configurações de dados
DATA_UPDATE_INTERVAL=5

# Configurações de segurança
JWT_SECRET=voltway_iot_secret_key_2024

# Configurações do frontend
FRONTEND_URL=http://localhost:8080
```

## 🏃‍♂️ Passo 3: Executar o Servidor

### 3.1 Iniciar em modo desenvolvimento
```bash
npm run dev
```

### 3.2 Verificar se está funcionando
- Abrir navegador em: `http://localhost:3000`
- Deve aparecer informações da API
- Health check: `http://localhost:3000/health`

## 📡 Passo 4: Testar Endpoints

### 4.1 Testar API principal
```bash
curl http://localhost:3000/
```

### 4.2 Testar health check
```bash
curl http://localhost:3000/health
```

### 4.3 Testar dados da estação
```bash
curl http://localhost:3000/api/station
```

## 🔌 Passo 5: Testar WebSocket

### 5.1 Abrir console do navegador
```javascript
// Conectar ao WebSocket
const socket = io('http://localhost:3000');

// Escutar atualizações
socket.on('stationUpdate', (data) => {
  console.log('Dados recebidos:', data);
});

// Solicitar dados atuais
socket.emit('getCurrentData');
```

## 🎯 Próximos Passos
1. ✅ Backend funcionando
2. 🔄 Criar frontend dashboard
3. 🔄 Criar código ESP32
4. 🔄 Integrar tudo

## 🐛 Solução de Problemas

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Port already in use"
```bash
# Mudar porta no .env
PORT=3001
```

### Erro: "Permission denied"
```bash
# Windows
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
