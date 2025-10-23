# 🔋 VoltWay IoT - Estação de Carregamento Inteligente

## 📚 O que você vai aprender

Este projeto é um **sistema IoT completo** que simula uma estação de carregamento de veículos elétricos. Você vai aprender:

### 🎯 Conceitos Fundamentais
- **IoT (Internet das Coisas)**: Como conectar dispositivos físicos à internet
- **Arquitetura de Sistemas**: Backend, Frontend e Hardware trabalhando juntos
- **Comunicação de Dados**: Como o ESP32 envia dados para o servidor
- **Tempo Real**: Visualização de dados em tempo real no celular

### 🛠️ Tecnologias que você vai dominar
- **ESP32**: Microcontrolador com WiFi integrado
- **Node.js**: Backend para receber e processar dados
- **WebSockets**: Comunicação em tempo real
- **HTML/CSS/JavaScript**: Interface web responsiva
- **Sensores**: Simulação de leituras de sensores

## 🏗️ Arquitetura do Sistema

```
┌─────────────┐    WiFi    ┌─────────────┐    HTTP/WS    ┌─────────────┐
│    ESP32    │ ────────── │   Backend   │ ───────────── │  Frontend   │
│ (Hardware)  │            │ (Node.js)   │               │ (Web App)   │
│             │            │             │               │             │
│ • Sensores  │            │ • API REST  │               │ • Dashboard │
│ • WiFi      │            │ • WebSocket │               │ • Gráficos  │
│ • Dados     │            │ • Banco     │               │ • Mobile    │
└─────────────┘            └─────────────┘               └─────────────┘
```

### 📊 Fluxo de Dados
1. **ESP32** lê sensores (temperatura, corrente, tensão)
2. **ESP32** envia dados via WiFi para o **Backend**
3. **Backend** processa e armazena os dados
4. **Backend** envia dados em tempo real para o **Frontend**
5. **Frontend** exibe dashboard no celular/computador

## 📁 Estrutura do Projeto

```
projeto-iot/
├── 📱 frontend/          # Interface web (dashboard)
├── 🖥️  backend/          # Servidor Node.js (API + WebSocket)
├── 🔌 esp32/            # Código do microcontrolador
├── 📚 docs/             # Documentação e tutoriais
└── 📖 README.md         # Este arquivo
```

## 🚀 Como começar

### 1. Backend (Servidor)
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (Dashboard)
```bash
cd frontend
# Abrir index.html no navegador
```

### 3. ESP32 (Hardware)
- Carregar código no ESP32
- Conectar à rede WiFi
- Ver dados chegando no dashboard

## 🎓 Objetivos de Aprendizado

### Para Iniciantes
- [ ] Entender o que é IoT
- [ ] Configurar ambiente de desenvolvimento
- [ ] Criar primeira API REST
- [ ] Conectar ESP32 ao WiFi

### Para Intermediários
- [ ] Implementar WebSockets
- [ ] Criar dashboard responsivo
- [ ] Simular sensores no ESP32
- [ ] Implementar autenticação

### Para Avançados
- [ ] Banco de dados em tempo real
- [ ] Notificações push
- [ ] Machine Learning para predições
- [ ] Deploy em nuvem

## 📖 Documentação Detalhada

- [📚 Guia de Iniciantes](docs/01-iniciantes.md)
- [🔧 Configuração do Ambiente](docs/02-ambiente.md)
- [🖥️ Backend - API REST](docs/03-backend.md)
- [🔌 ESP32 - Hardware](docs/04-esp32.md)
- [📱 Frontend - Dashboard](docs/05-frontend.md)
- [🌐 Deploy e Produção](docs/06-deploy.md)

## 🎯 Projeto Final

Ao final, você terá:
- ✅ Estação de carregamento simulada funcionando
- ✅ Dashboard web mostrando dados em tempo real
- ✅ ESP32 enviando dados via WiFi
- ✅ Sistema completo IoT funcionando
- ✅ Conhecimento para criar seus próprios projetos IoT

---

**🎓 Este é um projeto educacional focado no aprendizado prático de IoT!**