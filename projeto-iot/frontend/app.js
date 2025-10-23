// 🧠 JAVASCRIPT - VoltWay IoT Dashboard
// Este arquivo contém toda a lógica da aplicação frontend

// 🌐 CONFIGURAÇÃO INICIAL
const SERVER_URL = 'http://localhost:3000'; // URL do backend
let socket = null; // Conexão WebSocket
let powerChart = null; // Gráfico de potência
let tempChart = null; // Gráfico de temperatura

// 📊 DADOS HISTÓRICOS: Arrays para armazenar dados dos gráficos
const powerData = [];
const tempData = [];
const maxDataPoints = 20; // Máximo de pontos no gráfico

// 🎯 ELEMENTOS DOM: Referências aos elementos HTML
const elements = {
    connectionStatus: document.getElementById('connectionStatus'),
    stationStatus: document.getElementById('stationStatus'),
    batteryLevel: document.getElementById('batteryLevel'),
    batteryPercentage: document.getElementById('batteryPercentage'),
    powerValue: document.getElementById('powerValue'),
    tempValue: document.getElementById('tempValue'),
    dataTableBody: document.getElementById('dataTableBody')
};

// 🚀 INICIALIZAÇÃO: Função principal que inicia a aplicação
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 VoltWay Dashboard iniciando...');
    
    // Inicializar gráficos
    initializeCharts();
    
    // Conectar ao WebSocket
    connectToServer();
    
    // Carregar dados iniciais
    loadInitialData();
    
    console.log('✅ Dashboard inicializado com sucesso!');
});

// 🔌 CONEXÃO WEBSOCKET: Conecta ao servidor para dados em tempo real
function connectToServer() {
    console.log('🔌 Conectando ao servidor...');
    
    // Criar conexão Socket.IO
    socket = io(SERVER_URL);
    
    // 🎯 EVENTO: Conexão estabelecida
    socket.on('connect', function() {
        console.log('✅ Conectado ao servidor!');
        updateConnectionStatus(true);
        
        // Solicitar dados atuais
        socket.emit('getCurrentData');
    });
    
    // 🎯 EVENTO: Desconexão
    socket.on('disconnect', function() {
        console.log('❌ Desconectado do servidor!');
        updateConnectionStatus(false);
    });
    
    // 🎯 EVENTO: Dados atualizados (principal!)
    socket.on('stationUpdate', function(data) {
        console.log('📡 Dados recebidos:', data);
        updateDashboard(data);
        updateCharts(data);
        updateDataTable(data);
    });
    
    // 🎯 EVENTO: Erro de conexão
    socket.on('connect_error', function(error) {
        console.error('❌ Erro de conexão:', error);
        updateConnectionStatus(false);
    });
}

// 📊 INICIALIZAR GRÁFICOS: Cria os gráficos Chart.js
function initializeCharts() {
    console.log('📊 Inicializando gráficos...');
    
    // 🎯 GRÁFICO DE POTÊNCIA
    const powerCtx = document.getElementById('powerChart').getContext('2d');
    powerChart = new Chart(powerCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Potência (kW)',
                data: [],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Potência (kW)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tempo'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
    
    // 🎯 GRÁFICO DE TEMPERATURA
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperatura (°C)',
                data: [],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperatura (°C)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tempo'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
    
    console.log('✅ Gráficos inicializados!');
}

// 🔄 ATUALIZAR DASHBOARD: Atualiza os cards principais
function updateDashboard(data) {
    console.log('🔄 Atualizando dashboard...');
    
    // 🎯 STATUS DA ESTAÇÃO
    elements.stationStatus.textContent = getStatusText(data.status);
    elements.stationStatus.className = `status-value status-${data.status}`;
    
    // 🔋 NÍVEL DA BATERIA
    const batteryPercent = Math.round(data.batteryLevel || 0);
    elements.batteryLevel.style.width = `${batteryPercent}%`;
    elements.batteryPercentage.textContent = `${batteryPercent}%`;
    
    // ⚡ POTÊNCIA
    elements.powerValue.textContent = `${(data.chargingPower || 0).toFixed(1)} kW`;
    
    // 🌡️ TEMPERATURA
    elements.tempValue.textContent = `${Math.round(data.temperature || 0)}°C`;
    
    console.log('✅ Dashboard atualizado!');
}

// 📈 ATUALIZAR GRÁFICOS: Adiciona novos dados aos gráficos
function updateCharts(data) {
    const now = new Date().toLocaleTimeString();
    
    // 🎯 ADICIONAR DADOS DE POTÊNCIA
    powerData.push({
        x: now,
        y: data.chargingPower || 0
    });
    
    // 🎯 ADICIONAR DADOS DE TEMPERATURA
    tempData.push({
        x: now,
        y: data.temperature || 0
    });
    
    // 🎯 LIMITAR NÚMERO DE PONTOS
    if (powerData.length > maxDataPoints) {
        powerData.shift();
        tempData.shift();
    }
    
    // 🎯 ATUALIZAR GRÁFICOS
    powerChart.data.labels = powerData.map(d => d.x);
    powerChart.data.datasets[0].data = powerData.map(d => d.y);
    powerChart.update('none');
    
    tempChart.data.labels = tempData.map(d => d.x);
    tempChart.data.datasets[0].data = tempData.map(d => d.y);
    tempChart.update('none');
    
    console.log('📈 Gráficos atualizados!');
}

// 📋 ATUALIZAR TABELA: Atualiza a tabela de dados detalhados
function updateDataTable(data) {
    const tableData = [
        { label: 'ID da Estação', value: data.id || 'N/A', unit: '' },
        { label: 'Nome', value: data.name || 'N/A', unit: '' },
        { label: 'Status', value: getStatusText(data.status), unit: '' },
        { label: 'Nível da Bateria', value: Math.round(data.batteryLevel || 0), unit: '%' },
        { label: 'Potência', value: (data.chargingPower || 0).toFixed(1), unit: 'kW' },
        { label: 'Corrente', value: (data.chargingCurrent || 0).toFixed(1), unit: 'A' },
        { label: 'Tensão', value: (data.voltage || 0).toFixed(1), unit: 'V' },
        { label: 'Temperatura', value: Math.round(data.temperature || 0), unit: '°C' },
        { label: 'Tempo de Carregamento', value: Math.round(data.chargingTime || 0), unit: 'min' },
        { label: 'Última Atualização', value: formatDate(data.lastUpdate), unit: '' }
    ];
    
    elements.dataTableBody.innerHTML = tableData.map(row => `
        <tr>
            <td>${row.label}</td>
            <td>${row.value}</td>
            <td>${row.unit}</td>
            <td>${formatDate(data.lastUpdate)}</td>
        </tr>
    `).join('');
}

// 🔌 ATUALIZAR STATUS DE CONEXÃO: Atualiza indicador visual
function updateConnectionStatus(connected) {
    if (connected) {
        elements.connectionStatus.textContent = '🟢 Conectado';
        elements.connectionStatus.className = 'status-indicator connected';
    } else {
        elements.connectionStatus.textContent = '🔴 Desconectado';
        elements.connectionStatus.className = 'status-indicator disconnected';
    }
}

// 📥 CARREGAR DADOS INICIAIS: Busca dados via API REST
async function loadInitialData() {
    try {
        console.log('📥 Carregando dados iniciais...');
        
        const response = await fetch(`${SERVER_URL}/api/station`);
        const result = await response.json();
        
        if (result.success) {
            updateDashboard(result.data);
            updateDataTable(result.data);
            console.log('✅ Dados iniciais carregados!');
        } else {
            console.error('❌ Erro ao carregar dados:', result.error);
        }
    } catch (error) {
        console.error('❌ Erro de conexão:', error);
        updateConnectionStatus(false);
    }
}

// 🎯 FUNÇÕES AUXILIARES: Funções utilitárias

// 📝 OBTER TEXTO DO STATUS: Converte código para texto legível
function getStatusText(status) {
    const statusMap = {
        'available': 'Disponível',
        'charging': 'Carregando',
        'maintenance': 'Manutenção',
        'offline': 'Offline'
    };
    return statusMap[status] || 'Desconhecido';
}

// 📅 FORMATAR DATA: Converte timestamp para formato legível
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR');
}

// 🎯 TESTE DE CONEXÃO: Função para testar conectividade
function testConnection() {
    console.log('🧪 Testando conexão...');
    
    fetch(`${SERVER_URL}/health`)
        .then(response => response.json())
        .then(data => {
            console.log('✅ Servidor respondendo:', data);
            updateConnectionStatus(true);
        })
        .catch(error => {
            console.error('❌ Servidor não responde:', error);
            updateConnectionStatus(false);
        });
}

// 🔄 RECONECTAR: Função para reconectar manualmente
function reconnect() {
    console.log('🔄 Tentando reconectar...');
    if (socket) {
        socket.disconnect();
    }
    setTimeout(() => {
        connectToServer();
    }, 1000);
}

// 🎯 EXPORTAR FUNÇÕES: Para uso em console do navegador
window.testConnection = testConnection;
window.reconnect = reconnect;
window.socket = socket;

/* 
🎓 EXPLICAÇÃO PARA O ALUNO:

🔌 WEBSOCKET:
- Socket.IO permite comunicação bidirecional em tempo real
- Eventos 'connect', 'disconnect', 'stationUpdate' são escutados
- Dados chegam automaticamente sem precisar recarregar

📊 GRÁFICOS:
- Chart.js é uma biblioteca poderosa para visualização
- Dados são armazenados em arrays e limitados para performance
- Gráficos são atualizados em tempo real

🎯 DOM MANIPULATION:
- getElementById busca elementos HTML
- innerHTML e textContent atualizam conteúdo
- className modifica classes CSS

🔄 ASYNC/AWAIT:
- fetch() é usado para requisições HTTP
- async/await torna código assíncrono mais legível
- try/catch trata erros de forma elegante

🧠 ARQUITETURA:
- Separação clara entre lógica e apresentação
- Funções pequenas e específicas
- Console.log para debugging
- Código comentado e explicativo
*/
