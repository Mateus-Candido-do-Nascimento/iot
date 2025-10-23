// Importar bibliotecas
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicação Express
const app = express();

// Configurar middlewares
app.use(cors());  // Permitir requests de qualquer origem
app.use(express.json());  // Entender JSON no body

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 VoltWay Iot API está funcionando!',
    version: '1.0.0'
  });
});

// Rota de saúde da API
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎯 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});