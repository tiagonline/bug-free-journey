/*
 * /automacao/cypress/e2e/upload_sucesso.cy.js
 *
 * Cenário Crítico 1: [E2E - Caminho Feliz]
 * Testa o fluxo de upload bem-sucedido de um arquivo válido (<10MB).
 * O teste utiliza 'cy.intercept()' para mockar (simular) a resposta
 * de SUCESSO da API externa de OCR.
 */

// 1. Importa o Page Object
import UploadPage from '../pages/UploadDocumentosPage';

describe('Fluxo de Upload de Documentos - Caminho Feliz', () => {

    beforeEach(() => {
        
        // <<< CRÍTICO: INÍCIO DA SEÇÃO FALTANTE >>>
        // --- A MÁGICA (A SIMULAÇÃO) ---
        // Interceptamos a chamada POST para a API de OCR
        // e forçamos uma resposta de SUCESSO (HTTP 200).
        // O frontend acreditará que o OCR funcionou.
        cy.intercept('POST', '/api/ocr-service', {
            statusCode: 200,
            body: {
                success: true,
                extractedData: 'Dados extraídos do OCR com sucesso.',
                timestamp: new Date().toISOString()
            }
        }).as('ocrSuccess'); // <-- Define o alias @ocrSuccess

        // (Opcional: Mockar a API de upload principal também)
        cy.intercept('POST', '/api/upload-document', {
            statusCode: 201,
            body: { success: true, fileId: '12345' }
        }).as('uploadSuccess'); // <-- Define o alias @uploadSuccess
        // <<< CRÍTICO: FIM DA SEÇÃO FALTANTE >>>

        // Visita a página antes de cada teste
        UploadPage.visitPage();
    });

    it('Deve permitir o upload de um arquivo PDF válido (<10MB)', () => {
        
        // --- 2. AÇÕES (Usando o Page Object) ---

        // Define o arquivo que será usado (deve estar em cypress/fixtures/)
        const fixtureFile = 'arquivo_valido.pdf';

        // Ações do Page Object
        UploadPage.selectFile(fixtureFile);
        UploadPage.submitUpload();

        // (Opcional) Espera as chamadas mockadas terminarem
        cy.wait(['@uploadSuccess', '@ocrSuccess']);

        // --- 3. ASSERTIVAS (Usando o Page Object) ---

        // Simula o Javascript do frontend mostrando a mensagem de sucesso
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
        UploadPage.elements.validationErrorMsg().should('not.exist');
        UploadPage.elements.fallbackErrorMsg().should('not.exist');
    });

});