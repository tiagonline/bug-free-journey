# Entregável 4: Desafios Adicionais (Escala e Privacidade)

Nesta seção abordo estratégias de testes para expansão global da aplicação (LATAM, EMEA, NA) e a coleta de dados sensíveis (LGPD/GDPR).

### 4.1. Estratégia de Validação Geolocalizada

O desafio é simular usuários de diferentes regiões.

1.  **Mocking de Rede (Nível do Teste):** Se usássemos VPNs teríamos testes dependentes, caros e que podem ser lentos e instáveis. Trago duas soluções para que os testes fiquem auto contidos. Podemos em testes E2E com o **Cypress (`cy.intercept`)** mockar as chamadas que definem a localização do usuário (ex: uma API de geolocalização).

// Força a API a dizer que o usuário está no Brasil (BR)
cy.intercept('/api/get-user-location', { 
    statusCode: 200, 
    body: { region: 'LATAM', country: 'BR' } 
}).as('mockLocation');

cy.visit('/');

// Assertiva: Valida que o banner da LGPD apareceu
cy.get('#banner-lgpd').should('be.visible');
cy.get('#banner-gdpr').should('not.exist');


2.  **Headers HTTP:** Em testes de API (Postman/K6), enviaremos *headers* HTTP (como `CF-IPCountry`) para simular que a requisição origina de diferentes países (BR, DE, US).
3.  **Resultado Esperado:** O teste deve validar que o *banner* de consentimento correto (LGPD/GDPR) é exibido com base no IP simulado.

No script de K6 ou Postman,é possível forjar esse cabeçalho.
**Teste**: Simulando do Brasil

http.post(url, payload, { headers: { 'CF-IPCountry': 'BR' } });
**Resultado Esperado**: A resposta deve conter o script do banner da LGPD.

### 4.2. Testes Paralelos e Orquestração Distribuída

Minha idéia para rodar testes em ambientes distintos e de forma paralela:

1. **Containerização (Meu CV):** A suíte de automação (Cypress e K6) será 100% containerizada usando **Docker**.
2. **Orquestração de CI/CD (Meu CV):** O pipeline de **CI/CD (Github Actions ou CircleCI)** será configurado para rodar os testes em paralelo. O Cypress Cloud oferece isso nativamente, se pago, mas podemos orquestrar *jobs* paralelos no CircleCI, cada um rodando um *container* Docker com uma parte dos testes.
3. **K6:** O K6 (K6 Operator para **Kubernetes**) possui nativamente a possibilidade para testes distribuídos (orquestração de carga a partir de diferentes regiões). Podemos usá-lo por exemplo rodar mil VUs em 10 pods de Kubernetes, com isso termos 10k conteinerizados e distribuidos, e os resultados gerados de forma única.

### 4.3. Plano de Validação (Privacidade LGPD/GDPR)

Para validarmoa dados sensíveis, sugiro o plano focado em dois pilares:

1.  **Segurança dos Dados de Teste (Data Masking):**
    * **Não usar dados reais:** Os testes *nunca* devem usar dados de produção.
    * **Dados Fictícios:** Usaremos bibliotecas (ex: `faker.js`) para gerar dados sensíveis *fictícios* (ex: nomes, CPFs) em tempo de execução.
2.  **Testes de Permissão (Cross-Region):**
    * **Cenário de Risco:** "Um usuário da LATAM pode ver um documento sensível de um usuário da EMEA?"
    * **Teste (Cypress):** Criaremos um teste E2E que:
        1.  Loga como "Usuário A" (simulado da LATAM).
        2.  Tenta acessar (via URL direta) um documento pertencente ao "Usuário B" (simulado da EMEA).

        3.  **Assertiva:** O sistema deve retornar um erro "403 - Acesso Negado" ou redirecionar para o *dashboard*.
