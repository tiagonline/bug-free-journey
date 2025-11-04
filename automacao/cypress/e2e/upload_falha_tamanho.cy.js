/*
 * /automacao/cypress/e2e/upload_falha_tamanho.cy.js
 *
 * Cenário Crítico 2: [E2E - Falha de Regra]
 * Testa a validação de regra de negócio (<10MB) no frontend.
 * O teste simula o upload de um arquivo maior que o limite permitido.
 * A assertiva é que o erro deve ser mostrado IMEDIATAMENTE.
 */

// 1. Importa o Page Object
import UploadPage from '../pages/UploadDocumentosPage';

describe('Fluxo de Upload de Documentos - Falha de Regra (Tamanho)', () => {

    beforeEach(() => {
        // Visita a página antes de cada teste
        UploadPage.visitPage();
    });

    it('Deve exibir um erro de validação ao tentar enviar um arquivo > 10MB', () => {
        
        // --- 2. AÇÕES (Usando o Page Object) ---

        // Define o arquivo grande (deve estar em cypress/fixtures/)
        // NOTA: Crie um arquivo fictício grande, ex: 'arquivo_grande_15mb.jpg'
        const fixtureFile = 'arquivo_grande_15mb.jpg';

        // Ações do Page Object
        UploadPage.selectFile(fixtureFile);

        // Assumindo que a validação é instantânea ao selecionar,
        // ou após clicar em enviar (depende da regra de negócio).
        // Vamos assumir que clicamos em enviar para disparar a validação.
        UploadPage.submitUpload();

        // --- 3. ASSERTIVAS (Usando o Page Object) ---

        // Verifica a mensagem de ERRO DE VALIDAÇÃO
        UploadPage.elements.validationErrorMsg()
            .should('be.visible')
            .and('contain.text', 'Arquivo excede 10MB');

        // Garante que NENHUMA mensagem de sucesso apareceu
        UploadPage.elements.successMessage()
            .should('not.exist');
        
        // Garante que o erro de fallback (API) também não apareceu
        UploadPage.elements.fallbackErrorMsg()
            .should('not.exist');
    });

});