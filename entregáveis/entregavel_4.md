# Entregável 4: Desafios Adicionais (Escala e Privacidade)

[cite_start]Esta seção aborda a expansão global da aplicação (LATAM, EMEA, NA) e a coleta de dados sensíveis  93-94].

### 4.1. Estratégia de Validação Geolocalizada

[cite_start]O desafio é simular usuários de diferentes regiões.

1.  **Mocking de Rede (Nível do Teste):** A melhor abordagem não é usar VPNs (lento e instável). Usaremos o **Cypress (`cy.intercept`)** para mockar as chamadas que definem a localização do usuário (ex: uma API de geolocalização).
2.  **Headers HTTP:** Em testes de API (Postman/K6), enviaremos *headers* HTTP (como `X-Forwarded-For` ou `CF-IPCountry`) para simular que a requisição origina de diferentes países (BR, DE, US).
3.  **Assertivas:** O teste deve validar que o *banner* de consentimento correto (LGPD/GDPR) é exibido com base no IP simulado.

### 4.2. Testes Paralelos e Orquestração Distribuída

[cite_start]Para rodar testes em ambientes distintos e de forma paralela:

1. **Containerização (Meu CV):** A suíte de automação (Cypress e K6) será 100% containerizada usando **Docker**.
2. **Orquestração de CI/CD (Meu CV):** O pipeline de **CI/CD (Github Actions ou CircleCI)** será configurado para rodar os testes em paralelo. O Cypress Cloud oferece isso nativamente, mas podemos orquestrar *jobs* paralelos no CircleCI, cada um rodando um *container* Docker com uma parte dos testes.
3. **K6:** O K6 (K6 Operator para **Kubernetes**) é nativamente projetado para testes distribuídos (orquestração de carga a partir de diferentes regiões).

### 4.3. Plano de Validação (Privacidade LGPD/GDPR)

[cite_start]Para validar dados sensíveis, o plano foca em dois pilares:

1.  **Segurança dos Dados de Teste (Data Masking):**
    * **Não usar dados reais:** Os testes *nunca* devem usar dados de produção.
    * **Dados Fictícios:** Usaremos bibliotecas (ex: `faker.js`) para gerar dados sensíveis *fictícios* (ex: nomes, CPFs) em tempo de execução.
2.  **Testes de Permissão (Cross-Region):**
    * **Cenário de Risco:** "Um usuário da LATAM pode ver um documento sensível de um usuário da EMEA?"
    * **Teste (Cypress):** Criaremos um teste E2E que:
        1.  Loga como "Usuário A" (simulado da LATAM).
        2.  Tenta acessar (via URL direta) um documento pertencente ao "Usuário B" (simulado da EMEA).
        3.  **Assertiva:** O sistema deve retornar um erro "403 - Acesso Negado" ou redirecionar para o *dashboard*.