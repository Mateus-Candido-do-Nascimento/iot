// 🚀 SERVIDOR PRINCIPAL - VoltWay IoT Backend
// Este arquivo é o coração do nosso sistema IoT

// 📦 IMPORTAÇÕES - Bibliotecas necessárias
import express from 'express';        // Framework web para criar APIs
import cors from 'cors';              // Permite comunicação entre diferentes domínios
import dotenv from 'dotenv';          // Carrega variáveis de ambiente do arquivo .env
import { createServer } from 'http';  // Servidor HTTP nativo do Node.js
import { Server } from 'socket.io';   // WebSocket para comunicação em tempo real

// 🔧 CONFIGURAÇÃO INICIAL
dotenv.config(); // Carrega variáveis do arquivo .env

// 🌐 CRIANDO O SERVIDOR EXPRESS
const app = express();
const server = createServer(app);

// 🔌 CONFIGURANDO WEBSOCKET (Socket.IO)
const io = new Server(server, {
  cors: {
    origin: "*", // Permite conexões de qualquer origem (desenvolvimento)
    methods: ["GET", "POST"]
  }
});

// 📊 DADOS SIMULADOS - Por enquanto vamos usar dados mockados
// Depois vamos conectar com banco de dados real
let chargingStationData = {
  id: 'ESP32_001',
  name: 'Estação Principal',
  status: 'available', // available, charging, maintenance, offline
  batteryLevel: 0,     // Nível da bateria (0-100%)
  chargingPower: 0,    // Potência de carregamento (kW)
  chargingCurrent: 0,  // Corrente de carregamento (A)
  voltage: 0,          // Tensão (V)
  temperature: 25,     // Temperatura (°C)
  chargingTime: 0,     // Tempo de carregamento (minutos)
  lastUpdate: new Date().toISOString()
};

// 🛠️ MIDDLEWARES - Processadores de requisições
app.use(cors());                    // Permite CORS para frontend e ESP32
app.use(express.json());            // Permite receber dados JSON
app.use(express.static('public'));  // Serve arquivos estáticos (se houver)

// 🏠 ROTA PRINCIPAL - Informações da API
app.get('/', (req, res) => {
  res.json({
    message: '🔋 VoltWay IoT API - Estação de Carregamento Inteligente',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/health',
      station: '/api/station',
      data: '/api/station/data'
    },
    websocket: 'Conecte-se via Socket.IO para dados em tempo real'
  });
});

// 🏥 ROTA DE SAÚDE - Verifica se a API está funcionando
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 📡 ROTA DA ESTAÇÃO - Dados atuais da estação
app.get('/api/station', (req, res) => {
  res.json({
    success: true,
    data: chargingStationData,
    message: 'Dados da estação obtidos com sucesso'
  });
});

// 📊 ROTA DE DADOS HISTÓRICOS - Para gráficos e análises
app.get('/api/station/data', (req, res) => {
  // Por enquanto retorna dados mockados
  // Depois vamos implementar histórico real
  res.json({
    success: true,
    data: [chargingStationData],
    message: 'Dados históricos obtidos com sucesso'
  });
});

// 🔌 ROTA PARA RECEBER DADOS DO ESP32
app.post('/api/station/data', (req, res) => {
  try {
    const esp32Data = req.body;
    
    // 🧠 VALIDAÇÃO DOS DADOS
    if (!esp32Data.id || !esp32Data.status) {
      return res.status(400).json({
        success: false,
        error: 'Dados obrigatórios: id e status'
      });
    }

    // 📝 ATUALIZANDO DADOS DA ESTAÇÃO
    chargingStationData = {
      ...chargingStationData,
      ...esp32Data,
      lastUpdate: new Date().toISOString()
    };

    // 📡 ENVIANDO DADOS EM TEMPO REAL VIA WEBSOCKET
    io.emit('stationUpdate', chargingStationData);

    // ✅ RESPOSTA DE SUCESSO
    res.json({
      success: true,
      message: 'Dados recebidos e processados com sucesso',
      data: chargingStationData
    });

    console.log(`📡 Dados recebidos do ESP32: ${esp32Data.id} - Status: ${esp32Data.status}`);

  } catch (error) {
    console.error('❌ Erro ao processar dados do ESP32:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// 🔌 CONFIGURAÇÃO DO WEBSOCKET
io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);

  // 📡 Enviando dados atuais para o cliente recém-conectado
  socket.emit('stationUpdate', chargingStationData);

  // 📱 Cliente solicitou dados atuais
  socket.on('getCurrentData', () => {
    socket.emit('stationUpdate', chargingStationData);
  });

  // 🔌 Cliente desconectou
  socket.on('disconnect', () => {
    console.log(`🔌 Cliente desconectado: ${socket.id}`);
  });
});

// 🚀 INICIANDO O SERVIDOR
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('🎯 ===========================================');
  console.log('🔋 VoltWay IoT Backend - Estação de Carregamento');
  console.log('🎯 ===========================================');
  console.log(`🌐 Servidor rodando na porta: ${PORT}`);
  console.log(`📡 API REST: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/station`);
  console.log('🎯 ===========================================');
  console.log('✅ Pronto para receber dados do ESP32!');
  console.log('✅ Pronto para conectar frontend!');
});

// 🧠 EXPLICAÇÕES DETALHADAS:

/*
📦 IMPORTAÇÕES:
- express: Framework web que facilita criar APIs REST
- cors: Permite que frontend e ESP32 se comuniquem com nossa API
- dotenv: Carrega configurações do arquivo .env (senhas, URLs, etc.)
- socket.io: Permite comunicação em tempo real via WebSocket

🛠️ MIDDLEWARES:
- cors(): Permite requisições de qualquer origem (desenvolvimento)
- express.json(): Converte JSON das requisições em objetos JavaScript
- express.static(): Serve arquivos estáticos (HTML, CSS, JS)

📡 ROTAS:
- GET /: Informações básicas da API
- GET /health: Verifica se o servidor está funcionando
- GET /api/station: Dados atuais da estação
- POST /api/station/data: Recebe dados do ESP32

🔌 WEBSOCKET:
- io.on('connection'): Quando um cliente se conecta
- socket.emit(): Envia dados para um cliente específico
- io.emit(): Envia dados para todos os clientes conectados
- socket.on(): Escuta eventos do cliente

🎯 FLUXO DE DADOS:
1. ESP32 envia dados via POST /api/station/data
2. Servidor processa e valida os dados
3. Servidor atualiza dados em memória
4. Servidor envia dados em tempo real via WebSocket
5. Frontend recebe dados e atualiza dashboard
*/
