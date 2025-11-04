/*
 * /automacao/cypress/pages/UploadDocumentosPage.js
 * * Este Page Object (POM) centraliza todos os seletores e ações
 * da página de "Documentos Digitais".
 *
 * NOTA: Como o desafio é "cego" (sem ambiente), estou assumindo
 * seletores de CSS lógicos (ex: #file-input, #submit-button).
 * A estrutura é o que importa para o desafio.
 */
class UploadDocumentosPage {

    // --- 1. Elementos (Seletores) ---

    // Seletor (CSS Selector) para o input de arquivo
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

    // --- 2. Ações (Actions) ---

    /**
     * Ação: Visitar a página de upload.
     * (Assume que a 'baseUrl' está no cypress.config.js)
     */
    visitPage() {
        // Vai bater no HTML local de teste.
        cy.visit('./cypress/fixtures/index.html');
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

    /**
     * Ação: Clicar em Enviar
     */
    submitUpload() {
        this.elements.submitButton().click();
    }

}

// Exporta a *instância* da classe (padrão Cypress POM)
export default new UploadDocumentosPage();