### 3.1. Indicadores de Qualidade (KPIs)

Minha proposta de KPIs foca em dois pilares: **Métricas de Resultado (Outcome)**, que medem o impacto no negócio, e **Métricas de Processo (Output)**, que ajudam no diagnóstico diário.

#### A. Métricas de Resultado (Foco Principal: DORA)

Para uma visão moderna e acionável, o foco principal deve ser nas **Métricas DORA (Four Key Metrics)** (conforme a [referência oficial do Google Cloud](https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance)), que implementei na minha experiência como QA Tech Lead na Zak. Foi uma ação conjunta entre o time de QA, Desenvolvimento e Infra.

1.  **Lead Time for Changes (LTFC):** É o tempo entre o *commit* de uma correção no módulo "Documentos" e o *deploy* em produção. (Mede a eficiência do pipeline).
2.  **Deployment Frequency (DF):** Com que frequência fazemos deploy deste módulo. (Mede a agilidade).
3.  **Change Failure Rate (CFR):** (A "taxa de falhas" solicitada). Quantos *deploys* deste módulo resultam em *hotfix*? (Mede a estabilidade).
4.  **Time to Restore Service (TTRS):** (O "tempo de correção" solicitado). Se o serviço de OCR cair, quanto tempo levamos para restaurar o serviço? (Mede a resiliência).

#### B. Métricas de Processo (Diagnóstico e Performance)

Estas são métricas mais tradicionais (comumente usadas) que dão suporte à análise de causa-raiz das Métricas DORA.

5.  **Taxa de Fuga de Defeitos (Defect Escape Rate):** A métrica tradicional mais importante. Compara o nº de bugs encontrados em Produção (pelo cliente/suporte) vs. o nº de bugs encontrados em Homologação (pelo time de QA). *É acionável:* Se a taxa de fuga é alta, nosso processo de QA (Entregável 1) falhou.
6.  **Tempo de Resposta P95 (K6):** (A "performance" solicitada). O tempo de resposta para 95% das requisições de upload sob carga. *É acionável:* Se o P95 está acima do SLA, sabemos que o OCR síncrono é o gargalo.
7.  **Taxa de Erro (K6 Error Rate):** Percentual de falhas nos uploads sob carga.
8.  **Cobertura de Testes (Code Coverage):** (A "cobertura"). O percentual do código coberto por testes (Unitários, API, etc.). *É uma métrica de suporte, não de vaidade.* Uma baixa cobertura em áreas críticas (como o *retry* do OCR) é um *risco* que deve ser priorizado. Outro ponto é que nem sempre altas coberturas significam boa qualidade de testes.


### 3.2. Simulação de Relatório (Dashboard Acionável)

O "relatório simulado" não deve ser um documento estático (como esta tabela), mas sim um **dashboard de observabilidade em tempo real**. Uso aqui o Grafana.

Como demonstro no meu projeto [qa-k6-with-grafana](https://github.com/tiagonline/qa-k6-with-grafana), a melhor prática é usar o **K6** para enviar métricas de execução (Taxa de Erro, P95) diretamente para um *dashboard* no **Grafana**.

**Relatório Fictício (Exemplo de Dashboard):**
* **Painel 1 (Qualidade do Deploy):** Change Failure Rate (CFR): 35% 🔴
* **Painel 2 (Resiliência):** Time to Restore (TTRS): 4 horas 🟡
* **Painel 3 (Performance da API de Upload - K6/Grafana):**
    * Taxa de Erro (5 min): 8% 🔴
    * Tempo de Resposta P95 (5 min): 3500ms 🟡

### 3.3. Métricas Acionáveis (Tomada de Decisão com o time Produtos)

As métricas acima (do Grafana e do DORA) não são apenas números, elas são **acionáveis** e dão suporte à melhoria contínua.

Elas fornecem **dados objetivos** que direcionam o time a focar na **causa-raiz (o processo)**, em vez de procurar culpados individuais. A conversa muda de "Quem falhou? / O QA deixou passar!" para "O que no nosso processo falhou?".

* **Cenário 1 (CFR Alto):** "PM identifica que o **Change Failure Rate está em 35%** 🔴. Os dados mostram que as falhas vêm da integração com o OCR. Isso é **acionável**. Precisa pausar a 'feature xpto' e alocar uma *sprint* para estabilizar essa integração (Testes de Contrato/Mocks), senão continuará com falhas em produção."

* **Cenário 2 (Performance Ruim - K6/Grafana):** "O dashboard do Grafana mostra que o **P95 está em 3500ms** 🟡, acima do SLA, e a **Taxa de Erro está em 8%** 🔴. O gargalo é o OCR síncrono. Isso é **acionável**. Precisamos priorizar uma *task* para otimizar essa chamada ou torná-la *assíncrona*."




