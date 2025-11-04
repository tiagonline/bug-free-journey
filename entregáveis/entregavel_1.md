# Entregável 1: Plano Estratégico de Testes (Alto Nível)

Esta seção detalha o plano estratégico para garantir a qualidade do novo módulo "Documentos Digitais" .

### 1.1. Arquitetura e Pontos de Falha

A arquitetura descrita (Web App, API, Serviço Externo de OCR) apresenta 4 pontos críticos de falha que exigem estratégias de teste distintas:

1.  **Frontend (Web App):** Interface do usuário, validação de regras de negócio (ex: `<10MB`), e compatibilidade da visualização *inline*.
2.  **Backend (API "Documentos Digitais"):** Lógica de negócio da API, registro (logging) de eventos e a política de *retry* (tolerância a falhas).
3.  **Serviço Externo (API de OCR):** **Este é o maior risco.** A integração é *síncrona*, o que impacta diretamente a performance e a estabilidade. Pode falhar, ficar lento (timeout) ou retornar dados inválidos.
4.  **Performance & Carga:** O cenário de pico (cargas médias e altas) pode sobrecarregar a API, o *storage* ou o serviço de OCR. Ponto importante, ajustar a máquina que será executada a homologação com a mesma capacidade da máquina de produção mesmo que por um curto período de tempo para este fim.

### 1.2. Tipos de Testes e Justificativa (Pirâmide de Testes)

Minha estratégia aplica a mentalidade **Shift-Left**, garantindo qualidade em todas as camadas:

* **Testes Unitários (Responsabilidade do DEV):**
    * **Justificativa:** Validar regras puras (ex: a função que checa `tamanho < 10MB`) de forma rápida e isolada. Como Líder, eu monitoro a cobertura desses testes, como fiz na Minu (colaborando com DEVs em Jest/Jasmine).
* **Testes de API / Integração (Foco Principal do QA):**
    * **Justificativa:** Validar o *backend* (API de Documentos) de forma isolada, sem depender do *frontend*. Essencial para testar a resiliência e a política de *retry*.
    * **Ferramenta (do meu CV):** **Postman (Newman)**. Usaremos *mocks* para simular as respostas (sucesso, falha, timeout) do serviço de OCR.
    * **Rede de Proteção:** Criar uma rede de testes de API encadeadas que executa pelo menos uma vez ao dia no ambiente de homologação.
* **Testes de Contrato:**
    * **Justificativa:** Como o OCR é um serviço externo síncrono, precisamos garantir que o "contrato" (schema JSON) da integração não seja quebrado.
    * **Ferramenta:** (Mencionar PACT) Isso evita que uma mudança no OCR quebre nossa aplicação em produção.
* **Testes E2E (UI):**
    * **Justificativa:** Validar o fluxo completo do usuário (Jornada Feliz e Caminhos de Erro) na interface web.
    * **Ferramenta (do meu CV):** **Cypress**. Focaremos nos cenários críticos de *go-live*.
* **Testes de Performance (QA):**
    * **Justificativa:** Validar o requisito de "cargas médias e altas", focando no gargalo do OCR síncrono.
    * **Ferramenta (do meu CV):** **K6**. Criaremos scripts para simular uploads simultâneos.

### 1.3. Riscos e Premissas Assumidas

* **Premissas:**
    1.  **Avaliação de PR's:** Independente do time que o QA atual e até mesmo para nivelamento do time, é importante a avaliação de pull requests por pelo meno menos 50% do time de QA's.
* **Riscos Técnicos:**
    1.  **Gargalo do OCR:** Sendo síncrono e externo, ele *define* a performance da nossa *feature*.
    2.  **Inconsistência de Visualização:** O visualizador *inline* pode renderizar PDFs/JPEGs de forma diferente no Chrome vs. Safari. Avaliar o uso de Browserstack se possível.
    3.  **Falha de *Retry*:** A política de *retry*, se mal implementada, pode causar *looping* ou sobrecarregar o OCR.
* **Riscos Organizacionais (Premissas):**
    1.  **Premissa:** Assumo que o time de DEVs possui cultura de **Testes Unitários** (Shift-Left). Se não, o risco de sobrecarregar os testes E2E (Cypress) é alto, como já incentivei na Minu.
    2.  **Risco:** O time dono do OCR (se for externo/outro time) pode não ter um ambiente de *staging* estável para nossos testes de integração.

### 1.4. 5 Cenários Críticos para Go-Live (Bateria de Testes)

1.  **[E2E - Caminho Feliz]** Usuário faz upload de um PDF válido (<10MB). O sistema exibe a visualização *inline*, registra o log de sucesso e os dados do OCR são exibidos corretamente.
2.  **[E2E - Falha de Regra]** Usuário tenta fazer upload de um JPEG inválido (>10MB). O sistema deve bloquear o upload *imediatamente* (validação de *frontend*) e exibir a mensagem de erro "Arquivo excede 10MB".
3.  **[API - Tolerância a Falhas]** (Teste *backend* com Postman/Newman). Enviamos um arquivo válido para a API de Documentos, mas *mockamos* o serviço de OCR para retornar "Erro 500". 
**Assertiva:** Devemos validar que nosso log de *falha* foi registrado e que a política de *retry* foi acionada.
4.  **[Performance - Carga]** (Teste com K6). Simular 50 usuários fazendo uploads (5MB) simultaneamente (carga média/alta). **Assertiva:** O tempo de resposta da API de upload (P95) deve se manter aceitável e a taxa de erro deve ser 0%.
5.  **[E2E - Visualização Multi-Browser]** (Teste com Cypress). Fazer upload de um PDF e um JPEG válidos. 
**Assertiva:** Validar que a visualização *inline* é renderizada corretamente no Chrome e no Firefox.





