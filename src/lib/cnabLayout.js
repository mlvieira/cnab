export const layout = {
    // Registro 0: Header de Arquivo
    headerArquivo: {
        codigoBanco: { pos: 1, len: 3 },
        codigoLote: { pos: 4, len: 4 },
        tipoRegistro: { pos: 8, len: 1 },
        // ... many other fields
        nomeEmpresa: { pos: 73, len: 30 },
        nomeBanco: { pos: 103, len: 30 },
        codigoRemessaRetorno: { pos: 143, len: 1 },
        dataGeracaoArquivo: { pos: 144, len: 8 },
        horaGeracaoArquivo: { pos: 152, len: 6 },
        // ...
    },
    // Registro 1: Header de Lote
    headerLote: {
        codigoBanco: { pos: 1, len: 3 },
        codigoLote: { pos: 4, len: 4 },
        tipoRegistro: { pos: 8, len: 1 },
        tipoOperacao: { pos: 9, len: 1 },
        tipoServico: { pos: 10, len: 2 },
        // ...
        numeroVersaoLayoutLote: { pos: 14, len: 3 },
        // ...
        inscricaoEmpresaTipo: { pos: 19, len: 1 },
        inscricaoEmpresaNumero: { pos: 20, len: 14 },
        // ...
    },
    // Registro 3: Detalhe (Segmentos)
    detalhe: {
        codigoBanco: { pos: 1, len: 3 },
        codigoLote: { pos: 4, len: 4 },
        tipoRegistro: { pos: 8, len: 1 },
        numeroRegistro: { pos: 9, len: 5 },
        codigoSegmento: { pos: 14, len: 1 },
    },
    // Registro 5: Trailer de Lote
    trailerLote: {
        codigoBanco: { pos: 1, len: 3 },
        codigoLote: { pos: 4, len: 4 },
        tipoRegistro: { pos: 8, len: 1 },
        // ...
        quantidadeRegistrosLote: { pos: 18, len: 6 },
        somatoriaValores: { pos: 24, len: 18 },
        // ...
    },
    // Registro 9: Trailer de Arquivo
    trailerArquivo: {
        codigoBanco: { pos: 1, len: 3 },
        codigoLote: { pos: 4, len: 4 },
        tipoRegistro: { pos: 8, len: 1 },
        // ...
        quantidadeLotesArquivo: { pos: 18, len: 6 },
        quantidadeRegistrosArquivo: { pos: 24, len: 6 },
        // ...
    },
};

// Helper to extract field based on layout definition
export function extractField(line, fieldDefinition) {
    if (!fieldDefinition) return null;
    // Adjust position to be 0-based for substring
    return line.substring(fieldDefinition.pos - 1, fieldDefinition.pos - 1 + fieldDefinition.len).trim();
}
