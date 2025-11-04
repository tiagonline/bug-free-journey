/*
 * /automacao/cypress/e2e/upload_falha_ocr.cy.js
 *
 * Cenário Crítico 3: [API/E2E - Tolerância a Falhas]
 * Testa o requisito de "Tolerância a falhas" [cite: 74] e "simulação de 
 * resposta inválida e fallback" [cite: 85] do serviço de OCR.
 *
 * O teste simula um upload VÁLIDO, mas intercepta a chamada à
 * API de OCR e força um "Erro 500" (Internal Server Error).
 * A assertiva é que o frontend deve tratar esse erro e
 * mostrar uma mensagem de fallback amigável.
 */

// 1. Importa o Page Object
import UploadPage from '../pages/UploadDocumentosPage';

describe('Fluxo de Upload de Documentos - Falha de OCR (Tolerância a Falhas)', () => {

    beforeEach(() => {
        // --- A MÁGICA (A SIMULAÇÃO DE FALHA) ---
        // Interceptamos a chamada POST para a API de OCR
        // e forçamos uma resposta de FALHA (HTTP 500).
        cy.intercept('POST', '/api/ocr-service', {
            statusCode: 500,
            body: {
                success: false,
                error: 'OCR Service is currently unavailable or timed out.'
            }
        }).as('ocrFail');

        // (Mockar a API de upload principal com SUCESSO)
        // O upload do *arquivo* funcionou, mas o *OCR* falhou.
        cy.intercept('POST', '/api/upload-document', {
            statusCode: 201,
            body: { success: true, fileId: '12345' }
        }).as('uploadSuccess');

        // Visita a página antes de cada teste
        UploadPage.visitPage();
    });

    it('Deve exibir uma mensagem de erro (fallback) se o OCR falhar', () => {
        
        // --- 2. AÇÕES (Usando o Page Object) ---

        // Usamos um arquivo VÁLIDO
        const fixtureFile = 'arquivo_valido.pdf'; 

        // Ações do Page Object
        UploadPage.selectFile(fixtureFile);
        UploadPage.submitUpload();

        // Espera a chamada de upload (sucesso) e a de OCR (falha)
        cy.wait(['@uploadSuccess', '@ocrFail']);

        // --- 3. ASSERTIVAS (Usando o Page Object) ---

        // Verifica a mensagem de ERRO DE FALLBACK
        UploadPage.elements.fallbackErrorMsg()
            .should('be.visible')
            .and('contain.text', 'Erro ao processar documento. Tente novamente.'); // (Ou a mensagem que o sistema deve mostrar)

        // Garante que NENHUMA mensagem de sucesso apareceu
        UploadPage.elements.successMessage()
            .should('not.exist');
        
        // Garante que o erro de validação (tamanho) também não apareceu
        UploadVage.elements.validationErrorMsg()
            .should('not.exist');
    });

});