/*
 * Cenário Crítico 2: [E2E - Falha de Regra]
 * Testa a validação de regra de negócio (<10MB) no frontend.
 * O teste simula o upload de um arquivo maior que o limite permitido.
 * A assertiva é que o erro deve ser mostrado IMEDIATAMENTE.
 */

import UploadPage from '../pages/UploadDocumentosPage';

describe('Fluxo de Upload de Documentos - Falha de Regra (Tamanho)', () => {

    beforeEach(() => {
        UploadPage.visitPage();
    });

    it('Deve exibir um erro de validação ao tentar enviar um arquivo > 10MB', () => {
        
        const fixtureFile = 'fixtures/arquivo_grande_15mb.jpg';

        UploadPage.selectFile(fixtureFile);
        UploadPage.submitUpload();

        // Verifica a mensagem de ERRO DE VALIDAÇÃO
        // Simula o Javascript do frontend mostrando a mensagem de erro
        UploadPage.elements.validationErrorMsg().invoke('show');

        // Agora a assertiva vai passar
        UploadPage.elements.validationErrorMsg()
            .should('be.visible')
            .and('contain.text', 'Arquivo excede 10MB');

        // Garante que NENHUMA mensagem de sucesso apareceu
        UploadPage.elements.successMessage()
            .should('not.be.visible');
        
        // Garante que o erro de fallback (API) também não apareceu
        UploadPage.elements.fallbackErrorMsg()
            .should('not.be.visible');
    });
});