# Entregável 3: Métricas e Análise de Qualidade

Esta seção propõe os indicadores de qualidade  e como usá-los para tomada de decisão.

### 3.1. Indicadores de Qualidade (KPIs)

Para uma visão moderna e acionável, proponho o uso das **Métricas DORA (Four Key Metrics)** (conforme a [referência oficial do Google Cloud](https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance)), que implementei na minha experiência como QA Tech Lead na Zak. Foi uma ação conjunta entre os timse de QA, Desenvolvimento e Infra.

1.  **Lead Time for Changes (LTFC):** Tempo entre o *commit* de uma correção no módulo "Documentos" e o *deploy* em produção.
2.  **Deployment Frequency (DF):** Com que frequência fazemos deploy deste módulo.
3.  **Change Failure Rate (CFR):** (A "taxa de falhas" solicitada).Quantos *deploys* deste módulo resultam em *hotfix*?
4.  **Time to Restore Service (TTRS):** (O "tempo de correção" solicitado).Se o serviço de OCR cair, quanto tempo levamos para restaurar o serviço?
5.  **Métricas de Performance (K6):**
    * **Taxa de Erro (Error Rate):** Percentual de falhas nos uploads sob carga.
    * **Tempo de Resposta (P95):** O tempo de resposta para 95% das requisições de upload.

### 3.2. Simulação de Relatório (Dashboard Acionável)

O "relatório simulado"  150] solicitado não deve ser um documento estático (como esta tabela), mas sim um **dashboard de observabilidade em tempo real**.

Como demonstro no meu projeto [qa-k6-with-grafana](https://github.com/tiagonline/qa-k6-with-grafana), a melhor prática é usar o **K6** para enviar métricas de execução (Taxa de Erro, P95) diretamente para um *dashboard* no **Grafana**.

**Relatório Fictício (Exemplo de Dashboard):**
* **Painel 1 (Qualidade do Deploy):** Change Failure Rate (CFR): 35% 🔴
* **Painel 2 (Resiliência):** Time to Restore (TTRS): 4 horas 🟡
* **Painel 3 (Performance da API de Upload - K6/Grafana):**
    * Taxa de Erro (5 min): 8% 🔴
    * Tempo de Resposta P95 (5 min): 3500ms 🟡

### 3.3. Métricas Acionáveis (Tomada de Decisão com Produto)

As métricas acima (do Grafana e DORA) são acionáveis e movem a conversa de "culpa" para "processo":

* **Cenário 1 (CFR Alto):** "Sr. Product Owner, nossa **Change Failure Rate está em 35%** 🔴. Os dados mostram que as falhas vêm da integração com o OCR. Isso é **acionável**. Precisamos pausar a 'feature Y' e alocar uma *sprint* para estabilizar essa integração (Testes de Contrato/Mocks)."

***Cenário 2 (Performance Ruim - K6/Grafana):** "O dashboard do Grafana mostra que nosso **P95 está em 3500ms** 🟡, acima do SLA, e a **Taxa de Erro está em 8%** 🔴. O gargalo é o OCR síncrono 131]. Isso é **acionável**. Precisamos priorizar uma *task* para otimizar essa chamada ou torná-la *assíncrona*."


