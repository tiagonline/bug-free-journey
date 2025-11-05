/*
 * NOTA: Como o desafio é "cego" (sem ambiente), estou assumindo
 * seletores de CSS lógicos (ex: #file-input, #submit-button).
 */
class UploadDocumentosPage {


    elements = {
        fileInput: () => cy.get('#file-upload-input'),
        submitButton: () => cy.get('#file-upload-submit'),

        // Mensagem de erro de validação (ex: > 10MB)
        validationErrorMsg: () => cy.get('.error-message-validation'),
        // Mensagem de erro de fallback (ex: OCR falhou)
        fallbackErrorMsg: () => cy.get('.error-message-fallback'),
        // Mensagem de sucesso
        successMessage: () => cy.get('.success-message'),
        // (Bônus) O container do visualizador inline
        inlineViewer: () => cy.get('#pdf-viewer-inline')
    }

    visitPage() {
        cy.visit('fixtures/index.html');
    }

    /**
     * Ação: Fazer o upload do arquivo
     * O 'filePath' virá da pasta cypress/fixtures/
     * @param {string} filePath - Ex: 'arquivo_valido.pdf'
     */
    selectFile(filePath) {
        // O Cypress 'selectFile' anexa o arquivo ao input
        this.elements.fileInput().selectFile(filePath, { force: true });
    }

    submitUpload() {
        this.elements.submitButton().click();
    }

}

export default new UploadDocumentosPage();