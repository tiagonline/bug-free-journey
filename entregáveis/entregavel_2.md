# Entregável 2: Automação de Cenários Essenciais

Esta seção detalha a justificativa técnica para as ferramentas escolhidas e como executar o código-fonte (localizado na pasta `/automacao`).

### 2.1. Automação E2E (UI) - Cypress

* **Framework:** Cypress
* **Justificativa Técnica:** Escolhi o Cypress por ser a ferramenta *core* do meu perfil (utilizada na Zak e Minu). Ele é *all-in-one* (não precisa de Selenium) e sua função `cy.intercept()` é essencial para **mockar (simular) a API de OCR**. Isso nos permite testar o *fallback* e a resiliência da aplicação sem depender do serviço externo, como solicitado no desafio.

* **Prova de Conceito (PoC) de Arquitetura:** O desafio solicita como bônus "estrutura de page objects, separação clara de lógica de testes e configuração modular". O código na pasta `/automacao/cypress` atende a isso, mas para demonstrar minha experiência em arquitetura de *frameworks* Cypress em larga escala, **eu mantenho um projeto de referência completo no GitHub que implementa estas melhores práticas.**
    * **Link para o Projeto:** [**tiagonline/qa-cypress-automation (GitHub)**](https://github.com/tiagonline/qa-cypress-automation)
* **Como Rodar (Código do Desafio):**
    1.  `cd automacao/cypress`
    2.  `npm install`
    3.  `npx cypress open`

### 2.2. Automação de Performance (Carga) - K6 + Grafana

* **Framework:** K6 (com integração Grafana).
* **Justificativa Técnica:** O desafio exige validação de "cargas médias e altas" (cenários de pico). O K6 é a ferramenta ideal, pois é moderna, leve e baseada em Javascript (alinhada com o Cypress).
* **Prova de Conceito (PoC) de Observabilidade:** Para demonstrar como eu abordo performance de forma robusta e conecto testes a métricas (Entregável 3), **eu já possuo um *framework* completo de K6 integrado com Grafana para visualização de resultados em tempo real.**
    * **Link para o Projeto:** [**tiagonline/qa-k6-with-grafana (GitHub)**](https://github.com/tiagonline/qa-k6-with-grafana)
* **Script para este Desafio:** O script simples `upload_stress_test.js` (na pasta `/automacao/k6/scripts`) simula a carga básica solicitada no desafio, mas a arquitetura completa do link acima seria a implementação final.
* **Como Rodar (Script Simples):**
    1.  (Assumindo que o K6 está instalado globalmente)
    2.  `cd automacao/k6/scripts`
    3.  `k6 run upload_stress_test.js`

Ponto Importante: Como este teste é "cego" e a URL é fictícia, é esperado que a execução do K6 reporte 100% de falha de requisição. O script demonstra a estrutura do teste de carga, os estágios e os thresholds de SLA.