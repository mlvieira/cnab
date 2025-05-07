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
        // Layout base FEBRABAN
        // Nota: 'pos' permanece baseado em 1 para facilitar a comparação com especificações,
        // mas será convertido para base 0 internamente durante o parse.
        const baseLayout = {
            header_arquivo: {
                codigo_banco: { pos: [1, 3], tipo: "num" },
                lote_servico: { pos: [4, 7], tipo: "num" },
                tipo_registro: { pos: [8, 8], tipo: "num" },
                uso_exclusivo_febraban_1: { pos: [9, 17], tipo: "alfa" },
                tipo_inscricao: { pos: [18, 18], tipo: "num" },
                numero_inscricao: { pos: [19, 32], tipo: "num" },
                codigo_convenio: { pos: [33, 52], tipo: "alfa" },
                agencia: { pos: [53, 57], tipo: "num" },
                digito_agencia: { pos: [58, 58], tipo: "alfa" },
                conta: { pos: [59, 70], tipo: "num" },
                digito_conta: { pos: [71, 71], tipo: "alfa" },
                digito_ag_conta: { pos: [72, 72], tipo: "alfa" },
                nome_empresa: { pos: [73, 102], tipo: "alfa" },
                nome_banco: { pos: [103, 132], tipo: "alfa" },
                uso_exclusivo_febraban_2: { pos: [133, 142], tipo: "alfa" },
                codigo_remessa: { pos: [143, 143], tipo: "num" },
                data_geracao: { pos: [144, 151], tipo: "data" },
                hora_geracao: { pos: [152, 157], tipo: "time" },
                numero_sequencial: { pos: [158, 163], tipo: "num" },
                versao_layout: { pos: [164, 166], tipo: "num" },
                densidade_gravacao: { pos: [167, 171], tipo: "num" },
                uso_reservado_banco: { pos: [172, 191], tipo: "alfa" },
                uso_reservado_empresa: { pos: [192, 211], tipo: "alfa" },
                uso_exclusivo_febraban_3: { pos: [212, 240], tipo: "alfa" },
            },
            header_lote: {
                codigo_banco: { pos: [1, 3], tipo: "num" },
                lote_servico: { pos: [4, 7], tipo: "num" },
                tipo_registro: { pos: [8, 8], tipo: "num" },
                tipo_operacao: { pos: [9, 9], tipo: "alfa" },
                tipo_servico: { pos: [10, 11], tipo: "num" },
                uso_exclusivo_febraban_1: { pos: [12, 13], tipo: "alfa" },
                versao_layout_lote: { pos: [14, 16], tipo: "num" },
                uso_exclusivo_febraban_2: { pos: [17, 17], tipo: "alfa" },
                tipo_inscricao: { pos: [18, 18], tipo: "num" },
                numero_inscricao: { pos: [19, 32], tipo: "num" },
                codigo_convenio: { pos: [33, 52], tipo: "alfa" },
                agencia: { pos: [53, 57], tipo: "num" },
                digito_agencia: { pos: [58, 58], tipo: "alfa" },
                conta: { pos: [59, 70], tipo: "num" },
                digito_conta: { pos: [71, 71], tipo: "alfa" },
                digito_ag_conta: { pos: [72, 72], tipo: "alfa" },
                nome_empresa: { pos: [73, 102], tipo: "alfa" },
                mensagem: { pos: [103, 142], tipo: "alfa" },
                logradouro: { pos: [143, 172], tipo: "alfa" },
                numero: { pos: [173, 177], tipo: "num" },
                complemento: { pos: [178, 192], tipo: "alfa" },
                cidade: { pos: [193, 212], tipo: "alfa" },
                cep: { pos: [213, 217], tipo: "num" },
                complemento_cep: { pos: [218, 220], tipo: "alfa" },
                estado: { pos: [221, 222], tipo: "alfa" },
                uso_exclusivo_febraban_3: { pos: [223, 230], tipo: "alfa" },
                ocorrencias: { pos: [231, 240], tipo: "alfa" },
            },
            detalhe_segmento_a: {
                codigo_banco: { pos: [1, 3], tipo: "num" },
                lote_servico: { pos: [4, 7], tipo: "num" },
                tipo_registro: { pos: [8, 8], tipo: "num" },
                numero_registro: { pos: [9, 13], tipo: "num" },
                segmento: { pos: [14, 14], tipo: "alfa" },
                tipo_movimento: { pos: [15, 15], tipo: "num" },
                codigo_movimento: { pos: [16, 17], tipo: "num" },
                codigo_camara: { pos: [18, 20], tipo: "num" },
                codigo_banco_favorecido: { pos: [21, 23], tipo: "num" },
                agencia_favorecido: { pos: [24, 28], tipo: "num" },
                digito_agencia_favorecido: { pos: [29, 29], tipo: "alfa" },
                conta_favorecido: { pos: [30, 41], tipo: "num" },
                digito_conta_favorecido: { pos: [42, 42], tipo: "alfa" },
                digito_ag_conta_favorecido: { pos: [43, 43], tipo: "alfa" },
                nome_favorecido: { pos: [44, 73], tipo: "alfa" },
                numero_documento: { pos: [74, 93], tipo: "alfa" },
                data_pagamento: { pos: [94, 101], tipo: "data" },
                tipo_moeda: { pos: [102, 104], tipo: "alfa" },
                quantidade_moeda: { pos: [105, 119], tipo: "decimal", casas: 5 },
                valor_pagamento: { pos: [120, 134], tipo: "decimal", casas: 2 },
                nosso_numero: { pos: [135, 154], tipo: "alfa" },
                data_real_pagamento: { pos: [155, 162], tipo: "data" },
                valor_real_pagamento: { pos: [163, 177], tipo: "decimal", casas: 2 },
                informacao_complementar: { pos: [178, 217], tipo: "alfa" },
                complemento_finalidade: { pos: [218, 219], tipo: "alfa" },
                finalidade_ted: { pos: [220, 224], tipo: "alfa" },
                finalidade_doc: { pos: [225, 226], tipo: "alfa" },
                uso_exclusivo_cnab: { pos: [227, 229], tipo: "alfa" },
                aviso_favorecido: { pos: [230, 230], tipo: "num" },
                ocorrencias: { pos: [231, 240], tipo: "alfa" },
            },
            detalhe_segmento_b: {
                codigo_banco: { pos: [1, 3], tipo: "num" },
                lote_servico: { pos: [4, 7], tipo: "num" },
                tipo_registro: { pos: [8, 8], tipo: "num" },
                numero_registro: { pos: [9, 13], tipo: "num" },
                segmento: { pos: [14, 14], tipo: "alfa" },
                uso_exclusivo_cnab1: { pos: [15, 17], tipo: "alfa" },
                tipo_inscricao_favorecido: { pos: [18, 18], tipo: "num" },
                numero_inscricao_favorecido: { pos: [19, 32], tipo: "num" },
                endereco_logradouro: { pos: [33, 62], tipo: "alfa" },
                endereco_numero: { pos: [63, 67], tipo: "num" },
                endereco_complemento: { pos: [68, 82], tipo: "alfa" },
                endereco_bairro: { pos: [83, 97], tipo: "alfa" },
                endereco_cidade: { pos: [98, 117], tipo: "alfa" },
                endereco_cep: { pos: [118, 122], tipo: "num" },
                endereco_complemento_cep: { pos: [123, 125], tipo: "alfa" },
                endereco_estado: { pos: [126, 127], tipo: "alfa" },
                data_vencimento: { pos: [128, 135], tipo: "data" },
                valor_documento: { pos: [136, 150], tipo: "decimal", casas: 2 },
                valor_abatimento: { pos: [151, 165], tipo: "decimal", casas: 2 },
                valor_desconto: { pos: [166, 180], tipo: "decimal", casas: 2 },
                valor_mora: { pos: [181, 195], tipo: "decimal", casas: 2 },
                valor_multa: { pos: [196, 210], tipo: "decimal", casas: 2 },
                codigo_documento_favorecido: { pos: [211, 225], tipo: "alfa" },
                aviso_favorecido: { pos: [226, 226], tipo: "num" },
                codigo_ug_centralizadora: { pos: [227, 232], tipo: "num" },
                uso_exclusivo_cnab2: { pos: [233, 240], tipo: "alfa" },
            },
            detalhe_segmento_c: {
                codigo_banco: { pos: [1, 3], tipo: "num" },
                lote_servico: { pos: [4, 7], tipo: "num" },
                tipo_registro: { pos: [8, 8], tipo: "num" },
                numero_registro: { pos: [9, 13], tipo: "num" },
                segmento: { pos: [14, 14], tipo: "alfa" },
                uso_exclusivo_cnab1: { pos: [15, 17], tipo: "alfa" },
                valor_ir: { pos: [18, 32], tipo: "decimal", casas: 2 },
                valor_iss: { pos: [33, 47], tipo: "decimal", casas: 2 },
                valor_iof: { pos: [48, 62], tipo: "decimal", casas: 2 },
                valor_outras_deducoes: { pos: [63, 77], tipo: "decimal", casas: 2 },
                valor_outros_acrescimos: { pos: [78, 92], tipo: "decimal", casas: 2 },
                agencia_favorecido_rateio: { pos: [93, 97], tipo: "num" },
                digito_agencia_favorecido_rateio: { pos: [98, 98], tipo: "alfa" },
                conta_favorecido_rateio: { pos: [99, 110], tipo: "num" },
                digito_conta_favorecido_rateio: { pos: [111, 111], tipo: "alfa" },
                digito_ag_conta_favorecido_rateio: { pos: [112, 112], tipo: "alfa" },
                valor_inss: { pos: [113, 127], tipo: "decimal", casas: 2 },
                uso_exclusivo_cnab2: { pos: [128, 240], tipo: "alfa" },
            },
            detalhe_segmento_j: {
                codigo_banco: { pos: [1, 3], tipo: "num" },
                lote_servico: { pos: [4, 7], tipo: "num" },
                tipo_registro: { pos: [8, 8], tipo: "num" },
                numero_registro: { pos: [9, 13], tipo: "num" },
                segmento: { pos: [14, 14], tipo: "alfa" },
                tipo_movimento: { pos: [15, 15], tipo: "num" },
                codigo_movimento: { pos: [16, 17], tipo: "num" },
                codigo_barras: { pos: [18, 61], tipo: "alfa" },
                nome_beneficiario: { pos: [62, 91], tipo: "alfa" },
                data_vencimento: { pos: [92, 99], tipo: "data" },
                valor_titulo: { pos: [100, 114], tipo: "decimal", casas: 2 },
                valor_desconto: { pos: [115, 129], tipo: "decimal", casas: 2 },
                valor_acrescimo: { pos: [130, 144], tipo: "decimal", casas: 2 },
                data_pagamento: { pos: [145, 152], tipo: "data" },
                valor_pagamento: { pos: [153, 167], tipo: "decimal", casas: 2 },
                quantidade_moeda: { pos: [168, 182], tipo: "decimal", casas: 5 },
                referencia_sacado: { pos: [183, 202], tipo: "alfa" },
                nosso_numero: { pos: [203, 222], tipo: "alfa" },
                codigo_moeda: { pos: [223, 224], tipo: "num" },
                uso_exclusivo_cnab1: { pos: [225, 230], tipo: "alfa" },
                ocorrencias: { pos: [231, 240], tipo: "alfa" },
            },
            detalhe_segmento_j52: {
                codigo_banco: { pos: [1, 3], tipo: "num" },
                lote_servico: { pos: [4, 7], tipo: "num" },
                tipo_registro: { pos: [8, 8], tipo: "num" },
                numero_registro: { pos: [9, 13], tipo: "num" },
                segmento: { pos: [14, 14], tipo: "alfa" },
                uso_exclusivo_cnab1: { pos: [15, 15], tipo: "alfa" },
                codigo_registro_opcional: { pos: [16, 17], tipo: "num" },
                tipo_inscricao_pagador: { pos: [18, 18], tipo: "num" },
                numero_inscricao_pagador: { pos: [19, 33], tipo: "num" },
                nome_pagador: { pos: [34, 73], tipo: "alfa" },
                tipo_inscricao_beneficiario: { pos: [74, 74], tipo: "num" },
                numero_inscricao_beneficiario: { pos: [75, 89], tipo: "num" },
                nome_beneficiario: { pos: [90, 129], tipo: "alfa" },
                tipo_inscricao_sacador: { pos: [130, 130], tipo: "num" },
                numero_inscricao_sacador: { pos: [131, 145], tipo: "num" },
                nome_sacador: { pos: [146, 185], tipo: "alfa" },
                uso_exclusivo_cnab2: { pos: [186, 240], tipo: "alfa" },
            },
            detalhe_segmento_p: {
                codigo_banco: { pos: [1, 3], tipo: "num" },
                lote_servico: { pos: [4, 7], tipo: "num" },
                tipo_registro: { pos: [8, 8], tipo: "num" },
                numero_registro: { pos: [9, 13], tipo: "num" },
                segmento: { pos: [14, 14], tipo: "alfa" },
                uso_exclusivo_febraban_1: { pos: [15, 15], tipo: "alfa" },
                codigo_movimento: { pos: [16, 17], tipo: "num" },
                agencia: { pos: [18, 22], tipo: "num" },
                digito_agencia: { pos: [23, 23], tipo: "alfa" },
                conta: { pos: [24, 35], tipo: "num" },
                digito_conta: { pos: [36, 36], tipo: "alfa" },
                digito_ag_conta: { pos: [37, 37], tipo: "alfa" },
                nosso_numero: { pos: [38, 57], tipo: "alfa" },
                codigo_carteira: { pos: [58, 58], tipo: "num" },
                cadastramento: { pos: [59, 59], tipo: "num" },
                documento: { pos: [60, 60], tipo: "alfa" },
                emissao_boleto: { pos: [61, 61], tipo: "num" },
                distribuicao_boleto: { pos: [62, 62], tipo: "alfa" },
                numero_documento: { pos: [63, 77], tipo: "alfa" },
                vencimento: { pos: [78, 85], tipo: "data" },
                valor: { pos: [86, 100], tipo: "decimal", casas: 2 },
                agencia_cobradora: { pos: [101, 105], tipo: "num" },
                digito_ag_cobradora: { pos: [106, 106], tipo: "alfa" },
                especie: { pos: [107, 108], tipo: "num" },
                aceite: { pos: [109, 109], tipo: "alfa" },
                data_emissao: { pos: [110, 117], tipo: "data" },
                codigo_juros: { pos: [118, 118], tipo: "num" },
                data_juros: { pos: [119, 126], tipo: "data" },
                valor_juros: { pos: [127, 141], tipo: "decimal", casas: 2 },
                codigo_desconto: { pos: [142, 142], tipo: "num" },
                data_desconto: { pos: [143, 150], tipo: "data" },
                valor_desconto: { pos: [151, 165], tipo: "decimal", casas: 2 },
                valor_iof: { pos: [166, 180], tipo: "decimal", casas: 2 },
                valor_abatimento: { pos: [181, 195], tipo: "decimal", casas: 2 },
                uso_empresa: { pos: [196, 220], tipo: "alfa" },
                codigo_protesto: { pos: [221, 221], tipo: "num" },
                prazo_protesto: { pos: [222, 223], tipo: "num" },
                codigo_baixa: { pos: [224, 224], tipo: "num" },
                prazo_baixa: { pos: [225, 227], tipo: "num" },
                codigo_moeda: { pos: [228, 229], tipo: "num" },
                uso_exclusivo_banco: { pos: [230, 239], tipo: "num" },
                uso_exclusivo_febraban_2: { pos: [240, 240], tipo: "alfa" },
            },
            detalhe_segmento_q: {
                codigo_banco: { pos: [1, 3], tipo: "num" },
                lote_servico: { pos: [4, 7], tipo: "num" },
                tipo_registro: { pos: [8, 8], tipo: "num" },
                numero_registro: { pos: [9, 13], tipo: "num" },
                segmento: { pos: [14, 14], tipo: "alfa" },
                uso_exclusivo_febraban_1: { pos: [15, 15], tipo: "alfa" },
                codigo_movimento: { pos: [16, 17], tipo: "num" },
                tipo_inscricao: { pos: [18, 18], tipo: "num" },
                numero_inscricao: { pos: [19, 33], tipo: "num" },
                nome: { pos: [34, 73], tipo: "alfa" },
                logradouro: { pos: [74, 113], tipo: "alfa" },
                bairro: { pos: [114, 128], tipo: "alfa" },
                cep: { pos: [129, 133], tipo: "num" },
                complemento_cep: { pos: [134, 136], tipo: "alfa" },
                cidade: { pos: [137, 151], tipo: "alfa" },
                estado: { pos: [152, 153], tipo: "alfa" },
                sacador_tipo_inscricao: { pos: [154, 154], tipo: "num" },
                sacador_numero_inscricao: { pos: [155, 169], tipo: "num" },
                sacador_nome: { pos: [170, 209], tipo: "alfa" },
                codigo_banco_correspondente: { pos: [210, 212], tipo: "num" },
                nosso_numero_banco_correspondente: { pos: [213, 232], tipo: "alfa" },
                uso_exclusivo_febraban_2: { pos: [233, 240], tipo: "alfa" },
            },
            detalhe_segmento_r: {
                codigo_banco: { pos: [1, 3], tipo: "num" },
                lote_servico: { pos: [4, 7], tipo: "num" },
                tipo_registro: { pos: [8, 8], tipo: "num" },
                numero_registro: { pos: [9, 13], tipo: "num" },
                segmento: { pos: [14, 14], tipo: "alfa" },
                uso_exclusivo_febraban_1: { pos: [15, 15], tipo: "alfa" },
                codigo_movimento: { pos: [16, 17], tipo: "num" },
                codigo_desconto_2: { pos: [18, 18], tipo: "num" },
                data_desconto_2: { pos: [19, 26], tipo: "data" },
                valor_desconto_2: { pos: [27, 41], tipo: "decimal", casas: 2 },
                codigo_desconto_3: { pos: [42, 42], tipo: "num" },
                data_desconto_3: { pos: [43, 50], tipo: "data" },
                valor_desconto_3: { pos: [51, 65], tipo: "decimal", casas: 2 },
                codigo_multa: { pos: [66, 66], tipo: "num" },
                data_multa: { pos: [67, 74], tipo: "data" },
                valor_multa: { pos: [75, 89], tipo: "decimal", casas: 2 },
                informacao_pagador: { pos: [90, 99], tipo: "alfa" },
                mensagem_3: { pos: [100, 139], tipo: "alfa" },
                mensagem_4: { pos: [140, 179], tipo: "alfa" },
                uso_exclusivo_banco: { pos: [180, 199], tipo: "alfa" },
                codigo_ocorrencia_pagador: { pos: [200, 207], tipo: "num" },
                uso_exclusivo_febraban_2: { pos: [208, 240], tipo: "alfa" },
            },
            trailer_lote: {
                codigo_banco: { pos: [1, 3], tipo: "num" },
                lote_servico: { pos: [4, 7], tipo: "num" },
                tipo_registro: { pos: [8, 8], tipo: "num" },
                uso_exclusivo_febraban_1: { pos: [9, 17], tipo: "alfa" },
                quantidade_registros: { pos: [18, 23], tipo: "num" },
                somatoria_valores: { pos: [24, 41], tipo: "decimal", casas: 2 },
                somatoria_quantidade_moedas: { pos: [42, 59], tipo: "decimal", casas: 5 },
                numero_aviso_debito: { pos: [60, 65], tipo: "num" },
                uso_exclusivo_febraban_2: { pos: [66, 230], tipo: "alfa" },
                ocorrencias: { pos: [231, 240], tipo: "alfa" },
            },
            trailer_arquivo: {
                codigo_banco: { pos: [1, 3], tipo: "num" },
                lote_servico: { pos: [4, 7], tipo: "num" },
                tipo_registro: { pos: [8, 8], tipo: "num" },
                uso_exclusivo_febraban_1: { pos: [9, 17], tipo: "alfa" },
                quantidade_lotes: { pos: [18, 23], tipo: "num" },
                quantidade_registros: { pos: [24, 29], tipo: "num" },
                quantidade_contas_conciliadas: { pos: [30, 35], tipo: "num" },
                uso_exclusivo_febraban_2: { pos: [36, 240], tipo: "alfa" },
            },
        };

        // Atribui layouts aos bancos
        for (const bankCode in this.#bankCodes) {
            this.#layouts[bankCode] = JSON.parse(JSON.stringify(baseLayout));
            if (bankCode === '341') {
                this.#layouts[bankCode].detalhe_segmento_j_itau_ret_p1 = {
                    codigo_banco: { pos: [1, 3], tipo: "num" },
                    lote_servico: { pos: [4, 7], tipo: "num" },
                    tipo_registro: { pos: [8, 8], tipo: "num" },
                    numero_registro: { pos: [9, 13], tipo: "num" },
                    segmento: { pos: [14, 14], tipo: "alfa" },
                    tipo_movimento: { pos: [15, 15], tipo: "num" },
                    codigo_movimento: { pos: [16, 17], tipo: "num" },
                    codigo_barras_ou_id_titulo: { pos: [18, 61], tipo: "alfa" },
                    nome_beneficiario_original: { pos: [62, 91], tipo: "alfa" },
                    data_vencimento_original: { pos: [92, 99], tipo: "data" },
                    valor_titulo_original: { pos: [100, 114], tipo: "decimal", casas: 2 },
                    valor_desconto_original: { pos: [115, 129], tipo: "decimal", casas: 2 },
                    valor_acrescimo_original: { pos: [130, 144], tipo: "decimal", casas: 2 },
                    data_ocorrencia_ou_credito: { pos: [145, 152], tipo: "data" },
                    valor_efetivamente_pago_ou_creditado: { pos: [153, 167], tipo: "decimal", casas: 2 },
                    quantidade_moeda_liquidada: { pos: [168, 182], tipo: "decimal", casas: 5 },
                    seu_numero_ou_ref_pagador: { pos: [183, 202], tipo: "alfa" },
                    nosso_numero_banco: { pos: [203, 222], tipo: "alfa" },
                    codigo_moeda: { pos: [223, 224], tipo: "num" },
                    uso_banco_ou_ocorrencias_p1: { pos: [225, 240], tipo: "alfa" },
                };

                this.#layouts[bankCode].detalhe_segmento_j_itau_ret_p2 = {
                    codigo_banco: { pos: [1, 3], tipo: "num" },
                    lote_servico: { pos: [4, 7], tipo: "num" },
                    tipo_registro: { pos: [8, 8], tipo: "num" },
                    numero_registro: { pos: [9, 13], tipo: "num" },
                    segmento: { pos: [14, 14], tipo: "alfa" },
                    tipo_movimento_p2: { pos: [15, 15], tipo: "num" },
                    codigo_movimento_p2: { pos: [16, 17], tipo: "num" },
                    id_empresa_cedente_convenio: { pos: [18, 35], tipo: "alfa" },
                    nome_empresa_pagadora_ou_responsavel: { pos: [36, 74], tipo: "alfa" },
                    id_titulo_no_pagador: { pos: [75, 91], tipo: "alfa" },
                    nome_beneficiario_final_ou_sacado: { pos: [92, 131], tipo: "alfa" },
                    zeros_ou_data_pgto_p2: { pos: [132, 139], tipo: "alfa" },
                    zeros_ou_valor_pgto_p2: { pos: [140, 154], tipo: "alfa" },
                    filler_155_230: { pos: [155, 230], tipo: "alfa" },
                    ocorrencias_complementares: { pos: [231, 240], tipo: "alfa" },
                };
            }
            // --- Fim Overrides Específicos Itaú ---
        }
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
        if (!this.#layouts[bankCode]) {
            throw new Error(`Layout não encontrado para o código de banco: ${bankCode}`);
        }

        const bankName = this.#bankCodes[bankCode];
        const layout = this.#layouts[bankCode];
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
        };

        let currentLoteNum = null;
        let currentDetailGroup = null;
        let detailGroupCounter = 0;
        let expectingItauJPart2 = false;
        let tempItauJPart1Data = null;

        lines.forEach((line, index) => {
            const lineNumber = index + 1;

            if (line.trim() === "") {
                if (lineNumber < lines.length) {
                    result.warnings.push(`Linha ${lineNumber}: Linha vazia encontrada.`);
                }
                return;
            }

            result.file_info.non_empty_lines++;
            const lineLength = line.length;

            if (lineLength !== 240) {
                const errorMsg = `Linha ${lineNumber}: Tamanho inválido (${lineLength} caracteres, esperado 240).`;
                result.errors.push(errorMsg);
                console.error(errorMsg);
                return; // Pula processamento da linha inválida
            }

            try {
                const tipoRegistro = line.substring(7, 8);
                const loteServico = line.substring(3, 7);

                switch (tipoRegistro) {
                    case "0": {
                        if (result.header_arquivo) {
                            result.warnings.push(`Linha ${lineNumber}: Header de Arquivo duplicado encontrado.`);
                        }
                        const headerParseOutput = this.#parseRegistro(line, "header_arquivo", layout);
                        result.header_arquivo = headerParseOutput.data;
                        result.header_arquivo._lineNumber = lineNumber;
                        if (headerParseOutput.warnings.length > 0) {
                            result.warnings.push(...headerParseOutput.warnings.map(w => `Linha ${lineNumber} (Header Arq): ${w}`));
                        }
                        break;
                    }
                    case "1": {
                        currentLoteNum = parseInt(loteServico, 10);
                        if (isNaN(currentLoteNum) || currentLoteNum <= 0) {
                            result.warnings.push(`Linha ${lineNumber}: Número de Lote inválido '${loteServico}' no Header de Lote.`);
                            currentLoteNum = `invalid_${loteServico || 'empty'}`;
                        }
                        if (result.lotes[currentLoteNum]) {
                            result.warnings.push(`Linha ${lineNumber}: Header duplicado para Lote ${currentLoteNum}.`);
                        } else {
                            result.lotes[currentLoteNum] = {
                                header_lote: null,
                                detalhes_agrupados: [],
                                trailer_lote: null,
                                _startLine: lineNumber,
                            };
                        }
                        const loteHeaderParseOutput = this.#parseRegistro(line, "header_lote", layout);
                        result.lotes[currentLoteNum].header_lote = loteHeaderParseOutput.data;
                        result.lotes[currentLoteNum].header_lote._lineNumber = lineNumber;
                        if (loteHeaderParseOutput.warnings.length > 0) {
                            result.warnings.push(...loteHeaderParseOutput.warnings.map(w => `Linha ${lineNumber} (Header Lote ${currentLoteNum}): ${w}`));
                        }
                        detailGroupCounter = 0;
                        currentDetailGroup = null;
                        break;
                    }
                    case "3": {
                        if (currentLoteNum === null || !result.lotes[currentLoteNum]) {
                            result.errors.push(`Linha ${lineNumber}: Segmento Detalhe encontrado fora de um Lote válido.`);
                            expectingItauJPart2 = false;
                            tempItauJPart1Data = null;
                            break;
                        }

                        const segmento = line.substring(13, 14).toUpperCase();
                        const registroOpcional = line.substring(15, 17);

                        let layoutKeyToUse;
                        let segmentResultKeyToUse;
                        let isCurrentLineItauJ = false;

                        if (bankCode === '341' && segmento === 'J' && registroOpcional === '00') {
                            isCurrentLineItauJ = true;
                        }

                        if (!isCurrentLineItauJ) {
                            if (segmento === 'J' && registroOpcional === '52') {
                                layoutKeyToUse = 'detalhe_segmento_j52';
                                segmentResultKeyToUse = 'segmento_j52';
                            } else {
                                const segmentoLower = segmento.toLowerCase();
                                layoutKeyToUse = `detalhe_segmento_${segmentoLower}`;
                                segmentResultKeyToUse = `segmento_${segmentoLower}`;
                                if (registroOpcional && registroOpcional !== '00' && !(segmento === 'J' && registroOpcional === '52')) {
                                    segmentResultKeyToUse += registroOpcional;
                                }
                            }

                            if (!layout[layoutKeyToUse]) {
                                result.warnings.push(`Linha ${lineNumber}: Definição de layout faltando para '${layoutKeyToUse}'. Pulando linha.`);
                                break;
                            }

                            const parseOutput = this.#parseRegistro(line, layoutKeyToUse, layout);
                            const parsedSegmentData = parseOutput.data;
                            parsedSegmentData._lineNumber = lineNumber;
                            if (parseOutput.warnings.length > 0) {
                                result.warnings.push(...parseOutput.warnings.map(w => `Linha ${lineNumber} (${layoutKeyToUse.replace('detalhe_', '')}): ${w}`));
                            }

                            if (
                                ['A', 'P'].includes(segmento) ||
                                (segmento === 'J' && registroOpcional !== '52') // Standard J (not J52)
                            ) {
                                currentDetailGroup = { [segmentResultKeyToUse]: parsedSegmentData };
                                result.lotes[currentLoteNum].detalhes_agrupados[detailGroupCounter] = currentDetailGroup;
                                detailGroupCounter++;
                            } else if (currentDetailGroup) {
                                currentDetailGroup[segmentResultKeyToUse] = parsedSegmentData;
                                if (['B', 'C', 'Q', 'R'].includes(segmento) || (segmento === 'J' && registroOpcional === '52')) {
                                    currentDetailGroup = null;
                                }
                            } else {
                                result.warnings.push(`Linha ${lineNumber}: Segmento '${segmentResultKeyToUse}' encontrado fora de sequência esperada. Colocando em novo grupo.`);
                                currentDetailGroup = { [segmentResultKeyToUse]: parsedSegmentData, _incomplete_group: true };
                                result.lotes[currentLoteNum].detalhes_agrupados[detailGroupCounter] = currentDetailGroup;
                                detailGroupCounter++;
                                currentDetailGroup = null;
                            }
                        } else {
                            // --- ITAÚ SPECIFIC J (Return, two-part) LOGIC ---
                            if (expectingItauJPart2) {
                                layoutKeyToUse = 'detalhe_segmento_j_itau_ret_p2';
                            } else {
                                layoutKeyToUse = 'detalhe_segmento_j_itau_ret_p1';
                            }

                            if (!layout[layoutKeyToUse]) { // Check if the specific Itaú part layout exists
                                result.warnings.push(`Linha ${lineNumber}: Definição de layout faltando para Itaú J '${layoutKeyToUse}'. Pulando linha.`);
                                expectingItauJPart2 = false; // Reset expectation
                                tempItauJPart1Data = null;
                                break;
                            }

                            const parseOutput = this.#parseRegistro(line, layoutKeyToUse, layout);
                            const parsedSegmentData = parseOutput.data;
                            parsedSegmentData._lineNumber = lineNumber;
                            if (parseOutput.warnings.length > 0) {
                                result.warnings.push(...parseOutput.warnings.map(w => `Linha ${lineNumber} (${layoutKeyToUse.replace('detalhe_', '')}): ${w}`));
                            }

                            if (layoutKeyToUse === 'detalhe_segmento_j_itau_ret_p1') {
                                tempItauJPart1Data = parsedSegmentData;
                                expectingItauJPart2 = true;
                            } else if (layoutKeyToUse === 'detalhe_segmento_j_itau_ret_p2' && tempItauJPart1Data) {
                                currentDetailGroup = {
                                    segmento_j_itau_ret_p1: tempItauJPart1Data,
                                    segmento_j_itau_ret_p2: parsedSegmentData,
                                };
                                result.lotes[currentLoteNum].detalhes_agrupados[detailGroupCounter] = currentDetailGroup;
                                detailGroupCounter++;
                                tempItauJPart1Data = null;
                                expectingItauJPart2 = false;
                                currentDetailGroup = null;
                            } else if (layoutKeyToUse === 'detalhe_segmento_j_itau_ret_p2' && !tempItauJPart1Data) {
                                result.warnings.push(`Linha ${lineNumber}: Encontrado Itaú J Parte 2 sem uma Parte 1 correspondente. Adicionando como grupo incompleto.`);
                                currentDetailGroup = { segmento_j_itau_ret_p2: parsedSegmentData, _incomplete_group: true };
                                result.lotes[currentLoteNum].detalhes_agrupados[detailGroupCounter] = currentDetailGroup;
                                detailGroupCounter++;
                                expectingItauJPart2 = false;
                                currentDetailGroup = null;
                            }
                        }

                        break;
                    }
                    case "5": {
                        const trailerLoteNum = parseInt(loteServico, 10);
                        if (isNaN(trailerLoteNum) || !result.lotes[trailerLoteNum]) {
                            result.errors.push(`Linha ${lineNumber}: Trailer de Lote encontrado para Lote inválido ou inexistente '${loteServico}'.`);
                        } else {
                            if (result.lotes[trailerLoteNum].trailer_lote) {
                                result.warnings.push(`Linha ${lineNumber}: Trailer duplicado para Lote ${trailerLoteNum}.`);
                            }

                            const loteTrailerParseOutput = this.#parseRegistro(line, "trailer_lote", layout);
                            result.lotes[trailerLoteNum].trailer_lote = loteTrailerParseOutput.data;
                            result.lotes[trailerLoteNum].trailer_lote._lineNumber = lineNumber;
                            result.lotes[trailerLoteNum]._endLine = lineNumber;
                            if (loteTrailerParseOutput.warnings.length > 0) {
                                result.warnings.push(...loteTrailerParseOutput.warnings.map(w => `Linha ${lineNumber} (Trailer Lote ${trailerLoteNum}): ${w}`));
                            }

                            const expectedRegs = result.lotes[trailerLoteNum].detalhes_agrupados.reduce((count, group) => count + Object.keys(group).filter(k => !k.startsWith('_')).length, 0) + 2;
                            const actualRegs = parseInt(result.lotes[trailerLoteNum].trailer_lote.quantidade_registros, 10);
                            if (!isNaN(actualRegs) && actualRegs !== expectedRegs) {
                                result.warnings.push(`Lote ${trailerLoteNum}: Divergência na contagem de registros. Trailer informa ${actualRegs}, encontrados ${expectedRegs}.`);
                            }
                            currentLoteNum = null;
                            currentDetailGroup = null;
                        }
                        break;
                    }
                    case "9": {
                        if (result.trailer_arquivo) {
                            result.warnings.push(`Linha ${lineNumber}: Trailer de Arquivo duplicado encontrado.`);
                        }

                        const fileTrailerParseOutput = this.#parseRegistro(line, "trailer_arquivo", layout);
                        result.trailer_arquivo = fileTrailerParseOutput.data;
                        result.trailer_arquivo._lineNumber = lineNumber;
                        if (fileTrailerParseOutput.warnings.length > 0) {
                            result.warnings.push(...fileTrailerParseOutput.warnings.map(w => `Linha ${lineNumber} (Trailer Arq): ${w}`));
                        }

                        const expectedLotes = Object.keys(result.lotes).length;
                        const actualLotes = parseInt(result.trailer_arquivo.quantidade_lotes, 10);
                        const actualTotalRegs = parseInt(result.trailer_arquivo.quantidade_registros, 10);
                        if (!isNaN(actualLotes) && actualLotes !== expectedLotes) {
                            result.warnings.push(`Trailer Arquivo: Divergência na contagem de lotes. Trailer informa ${actualLotes}, encontrados ${expectedLotes}.`);
                        }
                        if (!isNaN(actualTotalRegs) && actualTotalRegs !== result.file_info.non_empty_lines) {
                            result.warnings.push(`Trailer Arquivo: Divergência na contagem de registros. Trailer informa ${actualTotalRegs}, encontradas ${result.file_info.non_empty_lines} linhas não vazias.`);
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
