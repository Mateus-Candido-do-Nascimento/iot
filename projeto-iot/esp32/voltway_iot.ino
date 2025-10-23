/*
 * 🔋 VoltWay IoT - Estação de Carregamento Simulada
 * 
 * 🎓 AULA: Programação IoT com ESP32
 * 
 * Este código simula uma estação de carregamento de veículos elétricos
 * que envia dados de sensores para um servidor web via WiFi.
 * 
 * 📚 CONCEITOS APRENDIDOS:
 * - Conexão WiFi com ESP32
 * - Requisições HTTP (POST)
 * - Simulação de sensores
 * - Comunicação IoT
 * - JSON para transmissão de dados
 * 
 * 🛠️ HARDWARE NECESSÁRIO:
 * - ESP32 DevKit
 * - Cabo USB para programação
 * - Conexão WiFi
 * 
 * 📡 FUNCIONALIDADES:
 * - Simula leitura de sensores (temperatura, corrente, tensão)
 * - Envia dados para servidor backend
 * - Monitora status da bateria
 * - Controla potência de carregamento
 * 
 * 🎯 OBJETIVO EDUCACIONAL:
 * Entender como dispositivos IoT se comunicam com servidores
 * e como criar sistemas de monitoramento em tempo real.
 */

// 📦 BIBLIOTECAS: Importar bibliotecas necessárias
#include <WiFi.h>           // WiFi do ESP32
#include <HTTPClient.h>     // Cliente HTTP para requisições
#include <ArduinoJson.h>    // Biblioteca para trabalhar com JSON
#include <Wire.h>           // Comunicação I2C (para sensores futuros)

// 🌐 CONFIGURAÇÕES DE REDE: Credenciais WiFi
const char* ssid = "SEU_WIFI_AQUI";           // Nome da sua rede WiFi
const char* password = "SUA_SENHA_AQUI";      // Senha da sua rede WiFi

// 🖥️ CONFIGURAÇÕES DO SERVIDOR: URL do backend
const char* serverURL = "http://192.168.1.100:3000/api/station/data";  // IP do seu computador
// 💡 DICA: Use "ipconfig" no Windows para descobrir seu IP local

// ⏰ CONFIGURAÇÕES DE TEMPO: Intervalos de execução
const unsigned long SEND_INTERVAL = 5000;     // Enviar dados a cada 5 segundos
const unsigned long SENSOR_INTERVAL = 1000;   // Ler sensores a cada 1 segundo

// 📊 VARIÁVEIS DE DADOS: Armazenar dados dos sensores
struct StationData {
  String id = "ESP32_001";           // ID único da estação
  String name = "Estacao_Principal"; // Nome da estação
  String status = "available";       // Status: available, charging, maintenance, offline
  float batteryLevel = 0.0;          // Nível da bateria (0-100%)
  float chargingPower = 0.0;         // Potência de carregamento (kW)
  float chargingCurrent = 0.0;       // Corrente de carregamento (A)
  float voltage = 0.0;               // Tensão (V)
  float temperature = 25.0;          // Temperatura (°C)
  int chargingTime = 0;              // Tempo de carregamento (minutos)
  String lastUpdate = "";            // Timestamp da última atualização
};

// 🎯 INSTÂNCIA DOS DADOS: Objeto para armazenar dados atuais
StationData stationData;

// ⏰ VARIÁVEIS DE TEMPO: Controle de intervalos
unsigned long lastSendTime = 0;
unsigned long lastSensorTime = 0;

// 🔄 VARIÁVEIS DE SIMULAÇÃO: Para simular comportamento realista
bool isCharging = false;
float targetBatteryLevel = 85.0;  // Nível alvo da bateria
float chargingRate = 0.5;         // Taxa de carregamento (% por segundo)

/*
 * 🚀 SETUP: Função executada uma vez na inicialização
 * 
 * 🎓 CONCEITO: Esta função é chamada automaticamente quando o ESP32 liga
 * É aqui que configuramos WiFi, sensores e outras inicializações
 */
void setup() {
  // 🖥️ INICIALIZAR SERIAL: Para debug e monitoramento
  Serial.begin(115200);  // Velocidade de comunicação serial
  delay(1000);           // Aguardar estabilização
  
  Serial.println("🔋 VoltWay IoT - Estação de Carregamento");
  Serial.println("========================================");
  
  // 🌐 CONECTAR WIFI: Estabelecer conexão com rede
  connectToWiFi();
  
  // 🎯 INICIALIZAR DADOS: Configurar dados iniciais
  initializeStationData();
  
  // 📡 TESTAR CONEXÃO: Verificar se servidor está acessível
  testServerConnection();
  
  Serial.println("✅ Sistema inicializado com sucesso!");
  Serial.println("📡 Pronto para enviar dados...");
}

/*
 * 🔄 LOOP: Função executada continuamente
 * 
 * 🎓 CONCEITO: Esta função roda em loop infinito
 * É aqui que fazemos leituras de sensores e envio de dados
 */
void loop() {
  unsigned long currentTime = millis();  // Tempo atual em milissegundos
  
  // 📊 LER SENSORES: Atualizar dados dos sensores
  if (currentTime - lastSensorTime >= SENSOR_INTERVAL) {
    readSensors();
    updateStationData();
    lastSensorTime = currentTime;
  }
  
  // 📡 ENVIAR DADOS: Enviar dados para servidor
  if (currentTime - lastSendTime >= SEND_INTERVAL) {
    sendDataToServer();
    lastSendTime = currentTime;
  }
  
  // 🎮 SIMULAR CONTROLES: Simular botões de controle
  simulateUserControls();
  
  delay(100);  // Pequena pausa para estabilidade
}

/*
 * 🌐 CONECTAR WIFI: Estabelecer conexão com rede WiFi
 * 
 * 🎓 CONCEITO: WiFi é a base da comunicação IoT
 * Sem WiFi, o ESP32 não consegue se comunicar com a internet
 */
void connectToWiFi() {
  Serial.print("🌐 Conectando ao WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);  // Iniciar conexão WiFi
  
  // 🔄 AGUARDAR CONEXÃO: Tentar conectar até conseguir
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  // ✅ VERIFICAR SUCESSO: Confirmar se conectou
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ WiFi conectado com sucesso!");
    Serial.print("📡 IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("📶 Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println();
    Serial.println("❌ Falha ao conectar WiFi!");
    Serial.println("🔧 Verifique as credenciais e tente novamente");
    // 💡 DICA: Em caso de erro, verifique SSID e senha
  }
}

/*
 * 🎯 INICIALIZAR DADOS: Configurar dados iniciais da estação
 * 
 * 🎓 CONCEITO: Dados iniciais definem o estado padrão do sistema
 * Isso é importante para garantir consistência
 */
void initializeStationData() {
  Serial.println("🎯 Inicializando dados da estação...");
  
  stationData.id = "ESP32_001";
  stationData.name = "Estacao_Principal";
  stationData.status = "available";
  stationData.batteryLevel = 20.0;      // Começar com 20% de bateria
  stationData.chargingPower = 0.0;
  stationData.chargingCurrent = 0.0;
  stationData.voltage = 0.0;
  stationData.temperature = 25.0;       // Temperatura ambiente
  stationData.chargingTime = 0;
  
  Serial.println("✅ Dados inicializados!");
}

/*
 * 📊 LER SENSORES: Simular leitura de sensores reais
 * 
 * 🎓 CONCEITO: Em um projeto real, aqui leríamos sensores físicos
 * Por enquanto, simulamos dados realistas para aprendizado
 */
void readSensors() {
  // 🌡️ SIMULAR TEMPERATURA: Variação realista
  stationData.temperature = 25.0 + random(-2, 8) + (isCharging ? 5.0 : 0.0);
  
  // ⚡ SIMULAR DADOS ELÉTRICOS: Baseado no status de carregamento
  if (isCharging) {
    // 🔋 CARREGANDO: Simular carregamento ativo
    stationData.chargingPower = 7.4 + random(-5, 10) / 10.0;  // 7.4 kW ± 0.5
    stationData.chargingCurrent = 32.0 + random(-3, 6);       // 32A ± 3
    stationData.voltage = 230.0 + random(-10, 20);            // 230V ± 10
    
    // 📈 AUMENTAR NÍVEL DA BATERIA: Simular carregamento
    stationData.batteryLevel += chargingRate;
    if (stationData.batteryLevel > targetBatteryLevel) {
      stationData.batteryLevel = targetBatteryLevel;
    }
    
    // ⏰ AUMENTAR TEMPO DE CARREGAMENTO
    stationData.chargingTime++;
    
  } else {
    // 🔌 DISPONÍVEL: Simular estação ociosa
    stationData.chargingPower = 0.0;
    stationData.chargingCurrent = 0.0;
    stationData.voltage = 0.0;
  }
  
  // 🎯 LIMITAR VALORES: Garantir valores dentro de limites realistas
  stationData.batteryLevel = constrain(stationData.batteryLevel, 0, 100);
  stationData.temperature = constrain(stationData.temperature, 15, 60);
}

/*
 * 🔄 ATUALIZAR DADOS: Atualizar informações da estação
 * 
 * 🎓 CONCEITO: Esta função processa os dados dos sensores
 * e atualiza o estado geral da estação
 */
void updateStationData() {
  // 🎯 ATUALIZAR STATUS: Baseado no estado atual
  if (isCharging) {
    stationData.status = "charging";
  } else {
    stationData.status = "available";
  }
  
  // 📅 ATUALIZAR TIMESTAMP: Marcar momento da atualização
  stationData.lastUpdate = getCurrentTimestamp();
  
  // 🎮 SIMULAR EVENTOS ALEATÓRIOS: Para tornar mais interessante
  if (random(1000) < 2) {  // 0.2% de chance
    stationData.status = "maintenance";
    Serial.println("🔧 Simulando modo manutenção...");
  }
}

/*
 * 📡 ENVIAR DADOS: Enviar dados para servidor backend
 * 
 * 🎓 CONCEITO: HTTP POST é usado para enviar dados
 * JSON é o formato padrão para comunicação web
 */
void sendDataToServer() {
  // ✅ VERIFICAR WIFI: Só enviar se conectado
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi desconectado! Tentando reconectar...");
    connectToWiFi();
    return;
  }
  
  // 🌐 CRIAR CLIENTE HTTP: Para fazer requisições
  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");
  
  // 📝 CRIAR JSON: Converter dados para formato JSON
  String jsonData = createJSONData();
  
  Serial.println("📡 Enviando dados para servidor...");
  Serial.println("📊 Dados: " + jsonData);
  
  // 🚀 ENVIAR REQUISIÇÃO: POST com dados JSON
  int httpResponseCode = http.POST(jsonData);
  
  // ✅ VERIFICAR RESPOSTA: Confirmar se envio foi bem-sucedido
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("✅ Dados enviados com sucesso!");
    Serial.println("📡 Resposta do servidor: " + response);
  } else {
    Serial.print("❌ Erro ao enviar dados: ");
    Serial.println(httpResponseCode);
    Serial.println("🔧 Verifique se o servidor está rodando");
  }
  
  http.end();  // Fechar conexão
}

/*
 * 📝 CRIAR JSON: Converter dados para formato JSON
 * 
 * 🎓 CONCEITO: JSON é o formato padrão para APIs web
 * É legível por humanos e fácil de processar
 */
String createJSONData() {
  // 📦 CRIAR DOCUMENTO JSON: Usando ArduinoJson
  DynamicJsonDocument doc(1024);
  
  // 📊 ADICIONAR DADOS: Preencher documento JSON
  doc["id"] = stationData.id;
  doc["name"] = stationData.name;
  doc["status"] = stationData.status;
  doc["batteryLevel"] = stationData.batteryLevel;
  doc["chargingPower"] = stationData.chargingPower;
  doc["chargingCurrent"] = stationData.chargingCurrent;
  doc["voltage"] = stationData.voltage;
  doc["temperature"] = stationData.temperature;
  doc["chargingTime"] = stationData.chargingTime;
  doc["lastUpdate"] = stationData.lastUpdate;
  
  // 🔄 CONVERTER PARA STRING: Serializar JSON
  String jsonString;
  serializeJson(doc, jsonString);
  
  return jsonString;
}

/*
 * 🎮 SIMULAR CONTROLES: Simular interação do usuário
 * 
 * 🎓 CONCEITO: Em um projeto real, aqui processaríamos botões físicos
 * Por enquanto, simulamos eventos baseados em tempo
 */
void simulateUserControls() {
  static unsigned long lastControlTime = 0;
  unsigned long currentTime = millis();
  
  // 🎯 SIMULAR INÍCIO DE CARREGAMENTO: A cada 30 segundos
  if (currentTime - lastControlTime > 30000) {
    if (!isCharging && stationData.batteryLevel < 80) {
      isCharging = true;
      targetBatteryLevel = 85.0;
      Serial.println("🔋 Iniciando carregamento simulado...");
    }
    lastControlTime = currentTime;
  }
  
  // 🎯 SIMULAR PARADA DE CARREGAMENTO: Quando bateria atinge 85%
  if (isCharging && stationData.batteryLevel >= targetBatteryLevel) {
    isCharging = false;
    Serial.println("✅ Carregamento concluído!");
  }
}

/*
 * 📅 OBTER TIMESTAMP: Gerar timestamp atual
 * 
 * 🎓 CONCEITO: Timestamp é importante para rastrear quando dados foram coletados
 * Em projetos reais, usaríamos RTC (Real Time Clock)
 */
String getCurrentTimestamp() {
  unsigned long currentTime = millis();
  unsigned long seconds = currentTime / 1000;
  unsigned long minutes = seconds / 60;
  unsigned long hours = minutes / 60;
  
  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;
  
  String timestamp = String(hours) + ":" + 
                    (minutes < 10 ? "0" : "") + String(minutes) + ":" + 
                    (seconds < 10 ? "0" : "") + String(seconds);
  
  return timestamp;
}

/*
 * 🧪 TESTAR CONEXÃO: Verificar se servidor está acessível
 * 
 * 🎓 CONCEITO: É importante testar conectividade antes de enviar dados
 * Isso evita erros e melhora a robustez do sistema
 */
void testServerConnection() {
  Serial.println("🧪 Testando conexão com servidor...");
  
  HTTPClient http;
  http.begin("http://192.168.1.100:3000/health");  // Endpoint de health check
  
  int httpResponseCode = http.GET();
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("✅ Servidor acessível!");
    Serial.println("📡 Resposta: " + response);
  } else {
    Serial.println("❌ Servidor não acessível!");
    Serial.println("🔧 Verifique se o backend está rodando");
    Serial.println("🔧 Verifique o IP do servidor no código");
  }
  
  http.end();
}

/*
 * 🎓 RESUMO DA AULA:
 * 
 * 📚 CONCEITOS APRENDIDOS:
 * 1. WiFi: Como conectar ESP32 à internet
 * 2. HTTP: Como enviar dados via POST
 * 3. JSON: Formato de dados para APIs
 * 4. Sensores: Como simular leituras de sensores
 * 5. IoT: Comunicação entre dispositivos e servidores
 * 
 * 🛠️ PRÓXIMOS PASSOS:
 * 1. Substituir simulações por sensores reais
 * 2. Adicionar botões físicos para controle
 * 3. Implementar autenticação
 * 4. Adicionar mais tipos de sensores
 * 5. Implementar OTA (Over-The-Air) updates
 * 
 * 🎯 APLICAÇÕES REAIS:
 * - Monitoramento de equipamentos industriais
 * - Sistemas de segurança
 * - Automação residencial
 * - Agricultura de precisão
 * - Monitoramento ambiental
 */
