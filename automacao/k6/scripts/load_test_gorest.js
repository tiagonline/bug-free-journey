/*
 * /automacao/k6/scripts/load_test_gorest.js
 *
 * Cenário: [Performance - Carga em Leitura]
 * Objetivo: Validar a estabilidade da API GoRest sob carga de consultas simultâneas.
 * Endpoint: GET /public/v2/users
 *
 * Estratégia:
 * - Carga moderada (até 20 VUs) para evitar Rate Limit (429) da API pública.
 * - Foco em latência (p95) e taxa de sucesso.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração do Teste
export const options = {
    // Stages define o comportamento da carga ao longo do tempo
    stages: [
        { duration: '30s', target: 5 },   // 1. Ramp-up (Aquecimento): sobe para 5 usuários
        { duration: '1m', target: 20 },   // 2. Carga: sobe para 20 usuários (Simula pico moderado)
        { duration: '30s', target: 20 },  // 3. Platô: mantém 20 usuários
        { duration: '10s', target: 0 },   // 4. Ramp-down: desce para 0
    ],
    
    // Critérios de Aceite (SLA)
    thresholds: {
        'http_req_failed': ['rate<0.01'],    // Erros devem ser menos de 1%
        'http_req_duration': ['p(95)<1000'], // 95% das requisições devem ser mais rápidas que 1s (1000ms)
    },
};

export default function () {
    // URL da API GoRest
    const url = 'https://gorest.co.in/public/v2/users';

    // Requisição GET (Consultar lista de usuários)
    const res = http.get(url);

    // Validações (Checkpoints)
    check(res, {
        'Status é 200 (OK)': (r) => r.status === 200,
        'Retornou lista de usuários (JSON)': (r) => r.body.includes('id') && r.body.includes('name'),
    });

    // Pausa para pensar (Think Time) - Simula comportamento humano e evita flood
    sleep(1);
}