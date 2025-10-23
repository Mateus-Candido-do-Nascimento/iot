# 🚀 Como Executar o Projeto VoltWay IoT

## 🎓 GUIA COMPLETO: Do Zero ao Sistema Funcionando

### 📋 Pré-requisitos

#### 🖥️ **Software Necessário**
- **Node.js** (versão 16+) - [Download](https://nodejs.org)
- **Arduino IDE** - [Download](https://www.arduino.cc/en/software)
- **Git** - [Download](https://git-scm.com)
- **Navegador Web** (Chrome, Firefox, Edge)

#### 🔌 **Hardware Necessário**
- **ESP32 DevKit** (qualquer modelo)
- **Cabo USB** (para programação)
- **Conexão WiFi** (para comunicação)

## 🚀 Passo 1: Configurar o Backend

### 1.1 Navegar para a pasta backend
```bash
cd projeto-iot/backend
```

### 1.2 Instalar dependências
```bash
npm install
```

### 1.3 Configurar variáveis de ambiente
Editar arquivo `.env`:
```env
PORT=3000
NODE_ENV=development
ESP32_IP=192.168.1.100
```

### 1.4 Executar o servidor
```bash
npm run dev
```

**✅ Verificar se funcionou:**
- Abrir navegador em: `http://localhost:3000`
- Deve aparecer informações da API

## 🚀 Passo 2: Configurar o Frontend

### 2.1 Abrir o dashboard
- Navegar para: `projeto-iot/frontend/index.html`
- Abrir no navegador (duplo clique)

### 2.2 Verificar conexão
- Dashboard deve mostrar "🔴 Desconectado"
- Aguardar alguns segundos
- Deve mudar para "🟢 Conectado"

## 🚀 Passo 3: Configurar o ESP32

### 3.1 Instalar Arduino IDE
- Baixar e instalar Arduino IDE
- Instalar ESP32 Board Package:
  - File → Preferences
  - Adicionar URL: `https://dl.espressif.com/dl/package_esp32_index.json`
  - Tools → Board → Boards Manager
  - Buscar "ESP32" e instalar

### 3.2 Instalar bibliotecas necessárias
- Tools → Manage Libraries
- Instalar:
  - **ArduinoJson** (por Benoit Blanchon)
  - **WiFi** (já incluída)

### 3.3 Configurar credenciais WiFi
Editar arquivo `voltway_iot.ino`:
```cpp
const char* ssid = "SEU_WIFI_AQUI";           // Nome da sua rede
const char* password = "SUA_SENHA_AQUI";      // Senha da sua rede
```

### 3.4 Configurar IP do servidor
Descobrir IP do seu computador:
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

Atualizar no código ESP32:
```cpp
const char* serverURL = "http://SEU_IP:3000/api/station/data";
```

### 3.5 Carregar código no ESP32
- Conectar ESP32 via USB
- Selecionar board: Tools → Board → ESP32 Dev Module
- Selecionar porta: Tools → Port → COM3 (ou similar)
- Clicar em Upload (seta para direita)

## 🚀 Passo 4: Testar o Sistema

### 4.1 Verificar ESP32
- Abrir Serial Monitor (Ctrl+Shift+M)
- Deve mostrar:
  ```
  🔋 VoltWay IoT - Estação de Carregamento
  🌐 Conectando ao WiFi: SUA_REDE
  ✅ WiFi conectado com sucesso!
  📡 IP Address: 192.168.1.XXX
  ```

### 4.2 Verificar Backend
- Terminal deve mostrar:
  ```
  🎯 Servidor rodando na porta 3000
  📡 Dados recebidos do ESP32: ESP32_001 - Status: available
  ```

### 4.3 Verificar Frontend
- Dashboard deve mostrar dados em tempo real
- Gráficos devem se atualizar
- Tabela deve mostrar informações

## 🔧 Solução de Problemas

### ❌ **ESP32 não conecta WiFi**
```cpp
// Verificar credenciais
const char* ssid = "NOME_EXATO_DA_REDE";
const char* password = "SENHA_CORRETA";
```

### ❌ **Backend não recebe dados**
- Verificar se ESP32 está conectado
- Verificar IP do servidor no código ESP32
- Verificar se backend está rodando na porta 3000

### ❌ **Frontend não conecta**
- Verificar se backend está rodando
- Verificar console do navegador (F12)
- Verificar se não há bloqueio de CORS

### ❌ **Dados não aparecem**
- Verificar Serial Monitor do ESP32
- Verificar console do navegador
- Verificar se WebSocket está funcionando

## 📊 Monitoramento do Sistema

### 🔍 **Serial Monitor (ESP32)**
```
🔋 VoltWay IoT - Estação de Carregamento
🌐 Conectando ao WiFi: MinhaRede
✅ WiFi conectado com sucesso!
📡 IP Address: 192.168.1.150
🧪 Testando conexão com servidor...
✅ Servidor acessível!
📡 Enviando dados para servidor...
📊 Dados: {"id":"ESP32_001","temperature":27.5,...}
✅ Dados enviados com sucesso!
```

### 🖥️ **Terminal Backend**
```
🎯 Servidor rodando na porta 3000
🔌 Cliente conectado: abc123
📡 Dados recebidos do ESP32: ESP32_001 - Status: charging
```

### 📱 **Console Frontend (F12)**
```
🎯 VoltWay Dashboard iniciando...
🔌 Conectando ao servidor...
✅ Conectado ao servidor!
📡 Dados recebidos: {id: "ESP32_001", temperature: 27.5, ...}
🔄 Atualizando dashboard...
```

## 🎯 Funcionalidades do Sistema

### 📊 **Dashboard em Tempo Real**
- ✅ Status da estação
- ✅ Nível da bateria (visual)
- ✅ Potência de carregamento
- ✅ Temperatura do sistema
- ✅ Gráficos históricos
- ✅ Tabela de dados detalhados

### 🔌 **ESP32 Simulado**
- ✅ Conexão WiFi automática
- ✅ Leitura de sensores simulados
- ✅ Envio de dados via HTTP POST
- ✅ Controle de carregamento
- ✅ Reconexão automática

### 🖥️ **Backend Robusto**
- ✅ API REST para receber dados
- ✅ WebSocket para tempo real
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ Logs detalhados

## 🎓 Conceitos Aprendidos

### 🌐 **IoT (Internet das Coisas)**
- Como conectar dispositivos físicos à internet
- Comunicação entre hardware e software
- Sistemas distribuídos em tempo real

### 📡 **Comunicação de Dados**
- HTTP POST para envio de dados
- WebSocket para tempo real
- JSON como formato de dados
- APIs REST para integração

### 🎨 **Interface de Usuário**
- HTML/CSS/JavaScript moderno
- Gráficos interativos
- Design responsivo
- Tempo real sem recarregar

### 🔧 **Desenvolvimento Full-Stack**
- Backend Node.js com Express
- Frontend web responsivo
- Hardware ESP32 programável
- Integração completa

## 🏆 Sistema Funcionando!

**🎉 Parabéns! Você criou um sistema IoT completo!**

### ✅ **O que você tem agora:**
- Estação de carregamento simulada
- Dashboard web em tempo real
- Comunicação ESP32 → Backend → Frontend
- Sistema escalável e educacional

### 🚀 **Próximos passos:**
- Adicionar sensores reais
- Implementar banco de dados
- Adicionar autenticação
- Deploy em nuvem
- Criar app mobile

---

**🎓 Este projeto demonstra todos os conceitos fundamentais de IoT!**
