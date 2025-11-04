/*
 * /automacao/k6/scripts/upload_stress_test.js
 *
 * Cenário Crítico 4: [Performance - Carga]
 * Simula um teste de carga ("stress test") contra a API de upload,
 * atendendo ao requisito de "validação de desempenho em cargas médias e altas".
 *
 * Este é um script SIMPLES. Como mencionado no "entregavel_2.md",
 * a arquitetura final usaria a integração K6 + Grafana
 * (como no meu projeto: tiagonline/qa-k6-with-grafana).
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// --- ARQUIVO DE TESTE (MOCKADO) ---
// Como não temos um arquivo real, criamos um binário fictício
// para simular o payload de um arquivo de 5MB.
// (Em um cenário real, poderíamos carregar um arquivo do disco)
const fileBin = new SharedArray('mockFile', function () {
    return [new Array(5 * 1024 * 1024).join('a')]; // 5MB de 'a'
});

// --- OPÇÕES DE EXECUÇÃO (Teste de Carga) ---
export const options = {
    // 'stages' define o ramp-up e ramp-down de usuários virtuais (VUs)
    stages: [
        { duration: '1m', target: 50 },  // 1. Rampa de 0 a 50 VUs em 1 minuto (Carga Média)
        { duration: '2m', target: 50 },  // 2. Mantém 50 VUs por 2 minutos
        { duration: '1m', target: 100 }, // 3. Rampa de 50 a 100 VUs em 1 minuto (Carga Alta/Pico)
        { duration: '2m', target: 100 }, // 4. Mantém 100 VUs por 2 minutos (Stress)
        { duration: '1m', target: 0 },   // 5. Rampa de 100 a 0 VUs em 1 minuto
    ],
    // 'thresholds' definem os SLAs (critérios de aceite)
    thresholds: {
        'http_req_failed': ['rate<0.01'],    // Taxa de falha HTTP deve ser < 1%
        'http_req_duration{p(95)}': ['p(95)<3000'], // 95% das requisições devem ser < 3s
    },
};

// --- FUNÇÃO PRINCIPAL (O TESTE) ---
export default function () {
    
    // A URL da API é fictícia, pois o desafio é "cego".
    const url = 'https://api.test.sigga/upload'; 

    // Pega o binário do arquivo
    const fileData = fileBin[0];
    
    // Monta o payload como 'multipart/form-data'
    const data = {
        // O nome 'file' é o 'name' esperado pelo input no backend
        file: http.file(fileData, 'documento_de_teste.pdf', 'application/pdf'), 
        // (Opcional) Enviar outros dados do formulário
        documentType: 'Invoice',
    };

    // --- REQUISIÇÃO HTTP ---
    const res = http.post(url, data);

    // --- ASSERTIVAS (Checks) ---
    check(res, {
        'API de Upload retornou status 201 (Created)': (r) => r.status === 201,
        'API de Upload retornou corpo (body) com sucesso': (r) => r.body.includes('success: true'),
    });

    sleep(1); // Pausa de 1 segundo entre iterações por VU
}