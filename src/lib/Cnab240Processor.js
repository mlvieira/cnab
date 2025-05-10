import { baseFebrabanLayout } from "../layouts/febrabanLayout";
import { itauLayout } from "../layouts/itauLayout";
/**
 * Processa arquivos CNAB 240 baseado nos padrões FEBRABAN.
 */
export class Cnab240Processor {
    #bankCodes = {
        "001": "Banco do Brasil",
        "033": "Santander",
        "104": "Caixa Econômica Federal",
        "237": "Bradesco",
        "341": "Itaú",
        "756": "Sicoob",
        "748": "Sicredi",
    };

    #layouts = {};

    #itauServiceLayouts = {
        // Pagamentos via Cheque, OP, DOC, TED, PIX Transferência, Crédito CC
        'CHEQUE_ETC': {
            header: 'header_lote_cheque_etc',
            trailer: 'trailer_lote_cheque_etc',
            segments: {
                'A': 'detalhe_segmento_a_cheque_etc', // Obrigatório
                'B': 'detalhe_segmento_b_cheque_etc', // Opcional (ou PIX Obrigatório)
                'C': 'detalhe_segmento_c_cheque_etc', // Opcional
                'D': 'detalhe_segmento_d_salario',    // Opcional (Holerite)
                'E': 'detalhe_segmento_e_salario',    // Opcional (Holerite)
                'F': 'detalhe_segmento_f_salario',    // Opcional (Holerite)
                'Z': 'detalhe_segmento_z_cheque_etc', // Opcional Retorno
                'J': 'detalhe_segmento_j_boleto_pixqr',    // Obrigatório
                'J52': 'detalhe_segmento_j52_boleto_pixqr', // Obrigatório (J52 normal ou J52 PIX)
            }
        },
        // Liquidação de Títulos (Boletos), PIX QR Code
        'BOLETO_PIXQR': {
            header: 'header_lote_boleto_pixqr',
            trailer: 'trailer_lote_boleto_pixqr',
            segments: {
                'J': 'detalhe_segmento_j_boleto_pixqr',    // Obrigatório
                'J52': 'detalhe_segmento_j52_boleto_pixqr', // Obrigatório (J52 normal ou J52 PIX)
                'B': 'detalhe_segmento_b_boleto_pixqr',    // Opcional
                'C': 'detalhe_segmento_c_boleto_pixqr',    // Opcional
                'Z': 'detalhe_segmento_z_boleto_pixqr',    // Opcional Retorno
            }
        },
        // Pagamento de Contas de Concessionárias e Tributos com Código de Barras
        'CONCESSIONARIA_CB': {
            header: 'header_lote_concessionaria_cb',
            trailer: 'trailer_lote_concessionaria_cb',
            segments: {
                'O': 'detalhe_segmento_o_concessionaria_cb', // Obrigatório
                'Z': 'detalhe_segmento_z_concessionaria_cb', // Opcional Retorno
            }
        },
        // Pagamento de Tributos sem Código de Barras e FGTS
        'TRIBUTO_SB_FGTS': {
            header: 'header_lote_tributo_sb_fgts',
            trailer: 'trailer_lote_tributo_sb_fgts',
            segments: {
                'N': 'detalhe_segmento_n_tributo_sb_fgts', // Obrigatório
                'B': 'detalhe_segmento_b_tributo_sb_fgts', // Opcional
                'W': 'detalhe_segmento_w_gare',           // Opcional GARE
                'Z': 'detalhe_segmento_z_tributo_sb_fgts', // Opcional Retorno
            }
        },
    };

    #itauTipoServicoMap = {
        // página 14 (Header Lote Cheque/OP/DOC/TED/PIX/Crédito CC)
        '10': 'CHEQUE_ETC', // Pagamento de Salários (might use D,E,F segments)
        '20': 'CHEQUE_ETC', // Pagamento Fornecedor
        '25': 'CHEQUE_ETC', // Pagamento Concessionárias (sem CB?) - Needs verification
        '30': 'CHEQUE_ETC', // Pagamento Salários (Conta Investimento?) - Needs verification
        '50': 'CHEQUE_ETC', // Pagamento Sinistros Seguros
        '60': 'CHEQUE_ETC', // Pagamento Despesas Viajante
        '70': 'CHEQUE_ETC', // Pagamento Autorizado
        '75': 'CHEQUE_ETC', // Pagamento Credenciados
        '80': 'CHEQUE_ETC', // Pagamento Representantes / Vendedores
        '90': 'CHEQUE_ETC', // Pagamento Benefícios
        '98': 'CHEQUE_ETC', // Pagamentos Diversos
        // página 30 (Header Lote Boletos/PIX QR)
        '03': 'BOLETO_PIXQR', // Boletos Outros Bancos
        '04': 'BOLETO_PIXQR', // Boletos Itaú
        '47': 'BOLETO_PIXQR', // PIX QR Code
        // página 39 (Header Lote Concessionárias/Tributos CB)
        '13': 'CONCESSIONARIA_CB', // Pagamento Contas Concessionárias
        '91': 'CONCESSIONARIA_CB', // Tributos com Código de Barras
        // página 43 (Header Lote Tributos SB/FGTS)
        '16': 'TRIBUTO_SB_FGTS', // DARF Normal
        '17': 'TRIBUTO_SB_FGTS', // GPS
        '18': 'TRIBUTO_SB_FGTS', // DARF Simples
        '22': 'TRIBUTO_SB_FGTS', // GARE SP
        '35': 'TRIBUTO_SB_FGTS', // FGTS
        '95': 'TRIBUTO_SB_FGTS', // GNRE e Tributos Estaduais
    };

    /**
     * Construtor - Inicializa os layouts.
     */
    constructor() {
        this.#initializeLayouts();
    }

    /**
     * Inicializa as definições de layout para cada banco.
     */
    #initializeLayouts() {
        this.#layouts['default'] = baseFebrabanLayout;
        this.#layouts['341'] = itauLayout;
    }

    /**
     * Remove potencial UTF-8 BOM (Byte Order Mark) do início do conteúdo.
     * @param {string} content - Conteúdo do arquivo.
     * @returns {string} Conteúdo sem BOM.
     */
    #removeBOM(content) {
        if (content.charCodeAt(0) === 0xef && content.charCodeAt(1) === 0xbb && content.charCodeAt(2) === 0xbf) {
            return content.substring(3);
        }
        return content;
    }

    /**
     * Detecta a sequência de quebra de linha usada no conteúdo do arquivo.
     * @param {string} content - Conteúdo do arquivo.
     * @returns {string} A quebra de linha detectada ('\r\n', '\n', ou '\r').
     */
    #detectLineEnding(content) {
        if (content.includes("\r\n")) {
            return "\r\n";
        } else if (content.includes("\n")) {
            return "\n";
        } else if (content.includes("\r")) {
            return "\r";
        }
        return "\n";
    }

    /**
     * Faz o parse de um registro específico (linha) baseado no seu tipo e no layout do banco.
     * @param {string} line - A string da linha a ser parseada.
     * @param {string} recordType - A chave para a definição do layout (e.g., 'header_arquivo').
     * @param {object} layout - O objeto de definição do layout para o banco.
     * @returns {object} Dados parseados para o registro.
     * @throws {Error} Se a definição do layout estiver faltando.
     */
    #parseRegistro(line, recordType, layout) {
        if (!layout || !layout[recordType]) {
            const segmentMatch = RegExp(/^detalhe_segmento_([a-z0-9]+)$/i).exec(recordType);
            if (segmentMatch) {
                const segmentUpper = segmentMatch[1].toUpperCase();
                if (layout[`detalhe_segmento_${segmentUpper}`]) {
                    recordType = `detalhe_segmento_${segmentUpper}`;
                } else {
                    throw new Error(
                        `Definição de layout não encontrada para o tipo de registro: ${recordType} ou segmento base ${segmentUpper}`,
                    );
                }
            } else {
                throw new Error(`Definição de layout não encontrada para o tipo de registro: ${recordType}`);
            }
        }

        const recordLayout = layout[recordType];
        const resultData = {};
        const fieldWarnings = [];
        resultData["_linha_original"] = line;

        for (const field in recordLayout) {
            const definition = recordLayout[field];
            const start = definition.pos[0] - 1;
            const end = definition.pos[1];
            let value = "";

            if (start >= 0 && end <= line.length) {
                value = line.substring(start, end);
            } else {
                console.warn(
                    `Campo '${field}' posição [${definition.pos[0]}, ${definition.pos[1]}] fora dos limites para linha de tamanho ${line.length}. Tipo de registro: ${recordType}`,
                );
            }

            const originalValue = value;
            let formattedValue;

            try {
                switch (definition.tipo) {
                    case "num":
                        formattedValue = value.replace(/^0+/, "") || "0";
                        break;
                    case "decimal": {
                        const casas = definition.casas ?? 2;
                        const divisor = Math.pow(10, casas);
                        let numStr = value.replace(/^0+/, "") || "0";
                        if (!/^\d+$/.test(numStr.trim())) {
                            fieldWarnings.push(`Campo '${field}': Conteúdo não numérico ('${originalValue}') encontrado em campo definido como 'decimal'.`);
                            formattedValue = originalValue;
                        } else {
                            formattedValue = (parseFloat(numStr) / divisor).toFixed(casas);
                        }
                        break;
                    }
                    case "data": {
                        const expectedLength = end - start;
                        if (value && value.length === expectedLength && value !== "0".repeat(expectedLength)) {
                            const d = value.substring(0, 2);
                            const m = value.substring(2, 4);
                            const a = value.substring(4, 8);
                            if (/^\d+$/.test(d) && /^\d+$/.test(m) && /^\d+$/.test(a)) {
                                formattedValue = `${d}/${m}/${a}`;
                            } else {
                                fieldWarnings.push(`Campo '${field}': Conteúdo não numérico ('${originalValue}') encontrado em campo definido como 'data'.`);
                                formattedValue = originalValue;
                            }
                        } else {
                            formattedValue = null;
                        }
                        break;
                    }
                    case "time": {
                        const expectedTimeLength = end - start;
                        if (value && value.length === expectedTimeLength && value !== "0".repeat(expectedTimeLength)) {
                            const h = value.substring(0, 2);
                            const min = value.substring(2, 4);
                            const s = value.substring(4, 6);
                            if (/^\d+$/.test(h) && /^\d+$/.test(min) && /^\d+$/.test(s)) {
                                formattedValue = `${h}:${min}:${s}`;
                            } else {
                                fieldWarnings.push(`Campo '${field}': Conteúdo não numérico ('${originalValue}') encontrado em campo definido como 'time'.`);
                                formattedValue = originalValue;
                            }
                        } else {
                            formattedValue = null;
                        }
                        break;
                    }
                    case "alfa":
                    default:
                        formattedValue = value;
                        break;
                }
            } catch (formatError) {
                console.error(`Erro formatando campo '${field}' com valor '${originalValue}' e tipo '${definition.tipo}':`, formatError);
                fieldWarnings.push(`Campo '${field}': Erro inesperado durante formatação do valor '${originalValue}' (Tipo: ${definition.tipo}).`);
                formattedValue = originalValue;
            }

            resultData[field] = formattedValue;
            resultData[`${field}_original`] = originalValue;
        }

        return { data: resultData, warnings: fieldWarnings };
    }

    #parseAndCollectWarnings(line, lineNumber, recordKey, layout, contextString, result) {
        const parseOutput = this.#parseRegistro(line, recordKey, layout);
        const parsedData = parseOutput.data;
        parsedData._lineNumber = lineNumber;
        if (parseOutput.warnings.length > 0) {
            result.warnings.push(...parseOutput.warnings.map(w => `Linha ${lineNumber} (${contextString}): ${w}`));
        }
        return parsedData;
    }

    /**
     * Faz o parse do conteúdo completo do arquivo CNAB.
     * @param {string} fileContent - O conteúdo raw (string) do arquivo CNAB.
     * @returns {object} Estrutura de dados parseada incluindo headers, lotes e trailers.
     * @throws {Error} Se o banco não for suportado ou o tamanho da linha estiver incorreto.
     */
    parse(fileContent) {
        if (!fileContent || typeof fileContent !== "string") {
            throw new Error("Conteúdo de arquivo inválido fornecido. Esperado uma string não vazia.");
        }

        const cleanContent = this.#removeBOM(fileContent);
        const bankCode = cleanContent.substring(0, 3);

        if (!this.#bankCodes[bankCode]) {
            throw new Error(`Código de banco não suportado: ${bankCode}`);
        }
        const layout = this.#layouts[bankCode] || this.#layouts['default'];
        if (!layout) {
            throw new Error(`Layout não encontrado para o código de banco: ${bankCode}`);
        }

        const bankName = this.#bankCodes[bankCode];
        const lineEnding = this.#detectLineEnding(cleanContent);
        const lines = cleanContent.split(lineEnding);

        let detectedLineEndingString;
        if (lineEnding === "\r\n") {
            detectedLineEndingString = "CRLF (Windows)";
        } else if (lineEnding === "\n") {
            detectedLineEndingString = "LF (Unix)";
        } else if (lineEnding === "\r") {
            detectedLineEndingString = "CR (Old Mac)";
        } else {
            detectedLineEndingString = "Desconhecido";
        }

        const result = {
            bank_code: bankCode,
            bank_name: bankName,
            header_arquivo: null,
            lotes: {},
            trailer_arquivo: null,
            warnings: [],
            errors: [],
            file_info: {
                total_lines_read: lines.length,
                non_empty_lines: 0,
                detected_line_ending: detectedLineEndingString,
            },
            lote_service_types: {}
        };

        let currentLoteNum = null;
        let currentLoteServiceTypeKey = null;
        let currentDetailGroup = null;
        let detailGroupCounter = 0;

        lines.forEach((line, index) => {
            const lineNumber = index + 1;
            result.file_info.non_empty_lines++;
            if (line.length !== 240) {
                return;
            }

            try {
                const tipoRegistro = line.substring(7, 8);
                const loteServico = line.substring(3, 7);

                switch (tipoRegistro) {
                    case "0": {
                        result.header_arquivo = this.#parseAndCollectWarnings(line, lineNumber, "header_arquivo", layout, "Header Arq", result);
                        break;
                    }
                    case "1": {
                        currentLoteNum = parseInt(loteServico, 10);
                        if (isNaN(currentLoteNum) || currentLoteNum <= 0) {
                            result.warnings.push(`Linha ${lineNumber}: Número de Lote inválido '${loteServico}' no Header de Lote.`);
                            currentLoteNum = `invalid_${loteServico || 'empty'}`;
                        }

                        const tipoServico = line.substring(9, 11);
                        currentLoteServiceTypeKey = this.#itauTipoServicoMap[tipoServico] || 'UNKNOWN';
                        result.lote_service_types[currentLoteNum] = currentLoteServiceTypeKey;

                        let headerLoteLayoutKey = 'header_lote';
                        if (currentLoteServiceTypeKey !== 'UNKNOWN' && this.#itauServiceLayouts[currentLoteServiceTypeKey]) {
                            headerLoteLayoutKey = this.#itauServiceLayouts[currentLoteServiceTypeKey].header;
                        } else {
                            result.warnings.push(`Linha ${lineNumber}: Tipo de Serviço '${tipoServico}' no Header Lote ${currentLoteNum} não mapeado ou layout de header específico não definido.`);
                            const fallbackKey = Object.keys(layout).find(k => k.startsWith('header_lote'));
                            if (fallbackKey) {
                                headerLoteLayoutKey = fallbackKey;
                                result.warnings.push(`Usando layout de header fallback: ${headerLoteLayoutKey}`);
                            } else {
                                result.errors.push(`Linha ${lineNumber}: Nenhum layout de Header de Lote encontrado.`);
                                break;
                            }
                        }

                        if (!result.lotes[currentLoteNum]) {
                            result.lotes[currentLoteNum] = { header_lote: null, detalhes_agrupados: [], trailer_lote: null, _startLine: lineNumber, _serviceTypeKey: currentLoteServiceTypeKey };
                        } else {
                            result.warnings.push(`Linha ${lineNumber}: Header duplicado para Lote ${currentLoteNum}.`);
                        }
                        if (!layout[headerLoteLayoutKey]) {
                            result.errors.push(`Linha ${lineNumber}: Layout '${headerLoteLayoutKey}' não encontrado no objeto de layout do banco.`);
                            break;
                        }

                        result.lotes[currentLoteNum].header_lote = this.#parseAndCollectWarnings(line, lineNumber, headerLoteLayoutKey, layout, `Header Lote ${currentLoteNum} (${currentLoteServiceTypeKey})`, result);
                        detailGroupCounter = 0;
                        currentDetailGroup = null;
                        break;
                    }
                    case "3": {
                        if (currentLoteNum === null || !result.lotes[currentLoteNum]) {
                            result.errors.push(`Linha ${lineNumber}: Segmento Detalhe encontrado fora de um Lote válido.`);
                            break;
                        }

                        const segmento = line.substring(13, 14).toUpperCase();
                        let codigoDoRegistroDetalhe = "";

                        if (segmento === 'J') {
                            codigoDoRegistroDetalhe = line.substring(17, 19);
                        }

                        const serviceTypeKey = result.lotes[currentLoteNum]._serviceTypeKey;
                        let layoutKeyToUse = null;
                        let segmentResultKey = `segmento_${segmento.toLowerCase()}`;
                        let specificKey = segmento;

                        if (segmento === 'J' && codigoDoRegistroDetalhe === '52') {
                            specificKey = 'J52';
                            segmentResultKey = 'segmento_j52';
                        }


                        if (serviceTypeKey && serviceTypeKey !== 'UNKNOWN' && this.#itauServiceLayouts[serviceTypeKey]) {
                            const serviceLayouts = this.#itauServiceLayouts[serviceTypeKey].segments;
                            layoutKeyToUse = serviceLayouts ? serviceLayouts[specificKey] : null;
                        }

                        if (!layoutKeyToUse || !layout[layoutKeyToUse]) {
                            const baseSegmentKey = `detalhe_segmento_${segmento.toLowerCase()}`;
                            if (layout[baseSegmentKey]) {
                                layoutKeyToUse = baseSegmentKey;
                                result.warnings.push(`Linha ${lineNumber}: Layout específico para Segmento '${segmento}' (Serviço: ${serviceTypeKey}) não encontrado ou definido. Usando layout base '${layoutKeyToUse}'.`);
                            } else {
                                result.warnings.push(`Linha ${lineNumber}: Definição de layout faltando para Segmento '${segmento}' (Serviço: ${serviceTypeKey}). Layout base '${baseSegmentKey}' também não encontrado. Pulando linha.`);
                                break;
                            }
                        }

                        const parsedSegmentData = this.#parseAndCollectWarnings(line, lineNumber, layoutKeyToUse, layout, `Segmento ${segmento} (Lote ${currentLoteNum})`, result);

                        const primarySegments = ['A', 'J', 'N', 'O', 'P'];
                        if (primarySegments.includes(segmento) && specificKey === segmento) {
                            currentDetailGroup = { [segmentResultKey]: parsedSegmentData };
                            result.lotes[currentLoteNum].detalhes_agrupados[detailGroupCounter] = currentDetailGroup;
                            detailGroupCounter++;
                        } else if (currentDetailGroup) {
                            currentDetailGroup[segmentResultKey] = parsedSegmentData;
                        } else {
                            result.warnings.push(`Linha ${lineNumber}: Segmento '${segmento}' encontrado fora de sequência esperada. Colocando em novo grupo.`);
                            currentDetailGroup = { [segmentResultKey]: parsedSegmentData, _incomplete_group: true };
                            result.lotes[currentLoteNum].detalhes_agrupados[detailGroupCounter] = currentDetailGroup;
                            detailGroupCounter++;
                            currentDetailGroup = null;
                        }
                        break;
                    }
                    case "5": {
                        if (currentLoteNum === null || !result.lotes[currentLoteNum]) {
                            result.errors.push(`Linha ${lineNumber}: Trailer de Lote encontrado fora de um Lote válido.`);
                            break;
                        }
                        const serviceTypeKey = result.lotes[currentLoteNum]._serviceTypeKey;
                        let trailerLoteLayoutKey = 'trailer_lote'; // Default
                        if (serviceTypeKey && serviceTypeKey !== 'UNKNOWN' && this.#itauServiceLayouts[serviceTypeKey]) {
                            trailerLoteLayoutKey = this.#itauServiceLayouts[serviceTypeKey].trailer;
                        } else {
                            result.warnings.push(`Linha ${lineNumber}: Tipo de Serviço '${serviceTypeKey}' no Trailer de Lote ${currentLoteNum} não mapeado ou layout de trailer específico não definido.`);
                            const fallbackKey = Object.keys(layout).find(k => k.startsWith('trailer_lote'));
                            if (fallbackKey) {
                                trailerLoteLayoutKey = fallbackKey;
                                result.warnings.push(`Usando layout de trailer fallback: ${trailerLoteLayoutKey}`);
                            }
                            else {
                                result.errors.push(`Linha ${lineNumber}: Nenhum layout de Trailer de Lote (específico ou base) encontrado.`);
                                break;
                            }
                        }

                        if (!layout[trailerLoteLayoutKey]) {
                            result.errors.push(`Linha ${lineNumber}: Layout '${trailerLoteLayoutKey}' (determinado para Tipo Serviço '${serviceTypeKey}') não encontrado no objeto de layout do banco.`);
                            break;
                        }

                        if (result.lotes[currentLoteNum].trailer_lote) {
                            result.warnings.push(`Linha ${lineNumber}: Trailer duplicado para Lote ${currentLoteNum}.`);
                        }
                        result.lotes[currentLoteNum].trailer_lote = this.#parseAndCollectWarnings(line, lineNumber, trailerLoteLayoutKey, layout, `Trailer Lote ${currentLoteNum} (${serviceTypeKey})`, result);
                        result.lotes[currentLoteNum]._endLine = lineNumber;

                        const lote = result.lotes[currentLoteNum];
                        const expectedRegs = (lote.detalhes_agrupados || []).reduce((count, group) => count + Object.keys(group).filter(k => !k.startsWith('_')).length, 0) + 2;
                        const actualRegs = parseInt(lote.trailer_lote.quantidade_registros, 10);
                        if (!isNaN(actualRegs) && actualRegs !== expectedRegs) {
                            result.warnings.push(`Lote ${currentLoteNum}: Divergência na contagem de registros. Trailer informa ${actualRegs}, encontrados ${expectedRegs}.`);
                        }

                        currentLoteNum = null;
                        currentDetailGroup = null;
                        currentLoteServiceTypeKey = null;
                        break;
                    }
                    case "9": {
                        result.trailer_arquivo = this.#parseAndCollectWarnings(line, lineNumber, "trailer_arquivo", layout, "Trailer Arq", result);
                        const expectedLotes = Object.keys(result.lotes).filter(k => !k.startsWith('invalid_')).length;
                        const actualLotes = parseInt(result.trailer_arquivo.quantidade_lotes_arquivo, 10);
                        if (!isNaN(actualLotes) && actualLotes !== expectedLotes) {
                            result.warnings.push(`Trailer Arquivo (Linha ${lineNumber}): Divergência na contagem de lotes. Trailer informa ${actualLotes}, encontrados ${expectedLotes}.`);
                        }

                        const actualTotalRegs = parseInt(result.trailer_arquivo.quantidade_registros_arquivo, 10);
                        if (!isNaN(actualTotalRegs) && actualTotalRegs !== result.file_info.non_empty_lines) {
                            result.warnings.push(`Trailer Arquivo (Linha ${lineNumber}): Divergência na contagem total de registros. Trailer informa ${actualTotalRegs}, linhas não vazias processadas ${result.file_info.non_empty_lines}.`);
                        }
                        break;
                    }
                    default:
                        result.warnings.push(`Linha ${lineNumber}: Tipo de Registro desconhecido '${tipoRegistro}'.`);
                        if (!result.unknown_lines) result.unknown_lines = [];
                        result.unknown_lines.push({ lineNumber, content: line });
                }
            } catch (e) {
                const errorMsg = `Erro processando linha ${lineNumber}: ${e.message}`;
                result.errors.push(errorMsg);
                console.error(errorMsg, e);
            }
        }); // Fim forEach linha

        // Verificações finais
        if (currentLoteNum !== null && result.lotes[currentLoteNum] && !result.lotes[currentLoteNum].trailer_lote) {
            result.warnings.push(`Arquivo finalizado, mas o Lote ${currentLoteNum} está sem Trailer (Registro 5).`);
        }
        if (!result.header_arquivo) {
            result.errors.push("Header de Arquivo (Registro 0) não encontrado.");
        }
        if (!result.trailer_arquivo) {
            result.errors.push("Trailer de Arquivo (Registro 9) não encontrado.");
        }

        return result;
    }
}
