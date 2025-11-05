/*
 * Cenário Crítico 3: [API/E2E - Tolerância a Falhas]
 * Testa o requisito de "Tolerância a falhas" e "simulação de 
 * resposta inválida e fallback" do serviço de OCR.
 *
 * O teste simula um upload VÁLIDO, mas intercepta a chamada à
 * API de OCR e força um "Erro 500" (Internal Server Error).
 * A assertiva é que o frontend deve tratar esse erro e
 * mostrar uma mensagem de fallback amigável.
 */

import UploadPage from '../pages/UploadDocumentosPage';

describe('Fluxo de Upload de Documentos - Falha de OCR (Tolerância a Falhas)', () => {

    beforeEach(() => {
        // Intercepto a chamada POST para a API de OCR e forço uma resposta de FALHA (HTTP 500).
        cy.intercept('POST', '/api/ocr-service', {
            statusCode: 500,
            body: {
                success: false,
                error: 'OCR Service is currently unavailable or timed out.'
            }
        }).as('ocrFail');

        // Mock da API de upload principal com SUCESSO
        // O upload do *arquivo* funcionou, mas o *OCR* falhou.
        cy.intercept('POST', '/api/upload-document', {
            statusCode: 201,
            body: { success: true, fileId: '12345' }
        }).as('uploadSuccess');

        UploadPage.visitPage();
    });

    it('Deve exibir uma mensagem de erro (fallback) se o OCR falhar', () => {
        
        const fixtureFile = 'arquivo_valido.pdf'; 

        UploadPage.selectFile(fixtureFile);
        UploadPage.submitUpload();

        // Espera a chamada de upload (sucesso) e a de OCR (falha)
        cy.wait(['@uploadSuccess', '@ocrFail']);

        // Valida a mensagem de ERRO DE FALLBACK
        UploadPage.elements.fallbackErrorMsg()
            .should('be.visible')
            .and('contain.text', 'Erro ao processar documento. Tente novamente.');

        // Garante que NENHUMA mensagem de sucesso apareceu
        UploadPage.elements.successMessage()
            .should('not.exist');
        
        // Garante que o erro de validação (tamanho) também não apareceu
        UploadVage.elements.validationErrorMsg()
            .should('not.exist');
    });
});