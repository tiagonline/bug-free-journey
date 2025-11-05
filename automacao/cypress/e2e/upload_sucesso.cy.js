/*
 * Cenário Crítico 1: [E2E - Caminho Feliz]
 * Testa o fluxo de upload bem-sucedido de um arquivo válido (<10MB).
 * O teste utiliza 'cy.intercept()' para mockar (simular) a resposta
 * de SUCESSO da API externa de OCR.
 */

import UploadPage from '../pages/UploadDocumentosPage';

describe('Fluxo de Upload de Documentos - Caminho Feliz', () => {
    beforeEach(() => {
        // Intercepto a chamada POST para a API de OCR e forço uma resposta de SUCESSO (HTTP 200).
        // O frontend acreditará que o OCR funcionou.
        cy.intercept('POST', '/api/ocr-service', {
            statusCode: 200,
            body: {
                success: true,
                extractedData: 'Dados extraídos do OCR com sucesso.',
                timestamp: new Date().toISOString()
            }
        }).as('ocrSuccess'); //Define o alias @ocrSuccess

        // (Mock da API de upload principal também)
        cy.intercept('POST', '/api/upload-document', {
            statusCode: 201,
            body: { success: true, fileId: '12345' }
        }).as('uploadSuccess'); //Define o alias @uploadSuccess

        // Visita a página antes de cada teste
        UploadPage.visitPage();
    });

    it('Deve permitir o upload de um arquivo PDF válido (<10MB)', () => {
        
        const fixtureFile = 'fixtures/arquivo_valido.pdf';

        UploadPage.selectFile(fixtureFile);
        UploadPage.submitUpload();
        cy.wait(['@uploadSuccess', '@ocrSuccess']);

        //Validações pós-upload

        UploadPage.elements.successMessage().invoke('show');
        UploadPage.elements.inlineViewer().invoke('show');

        // Verifica a mensagem de sucesso
        UploadPage.elements.successMessage()
            .should('be.visible')
            .and('contain.text', 'Upload concluído com sucesso');

        // Verifica se o visualizador inline apareceu
        UploadPage.elements.inlineViewer()
            .should('be.visible');

        // Verifica se NENHUMA mensagem de erro apareceu
        UploadPage.elements.validationErrorMsg().should('not.be.visible');
        UploadPage.elements.fallbackErrorMsg().should('not.be.visible');
    });
});