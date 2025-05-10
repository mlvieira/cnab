export const itauLayout = {
    // === REGISTRO HEADER DE ARQUIVO (Pg 13) ===
    header_arquivo: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" }, // 0000
        tipo_registro: { pos: [8, 8], tipo: "num" }, // 0
        filler_009_014: { pos: [9, 14], tipo: "alfa" }, // Brancos
        layout_arquivo: { pos: [15, 17], tipo: "num" }, // 080 neste manual
        tipo_inscricao: { pos: [18, 18], tipo: "num" },
        numero_inscricao: { pos: [19, 32], tipo: "num" },
        filler_033_052: { pos: [33, 52], tipo: "alfa" }, // Brancos (sem convenio aqui)
        agencia: { pos: [53, 57], tipo: "num" },
        filler_058_058: { pos: [58, 58], tipo: "alfa" }, // Branco
        conta: { pos: [59, 70], tipo: "num" },
        filler_071_071: { pos: [71, 71], tipo: "alfa" }, // Branco
        dac: { pos: [72, 72], tipo: "num" }, // DAC Ag/Conta
        nome_empresa: { pos: [73, 102], tipo: "alfa" },
        nome_banco: { pos: [103, 132], tipo: "alfa" },
        filler_133_142: { pos: [133, 142], tipo: "alfa" }, // Brancos
        codigo_remessa_retorno: { pos: [143, 143], tipo: "num" },
        data_geracao: { pos: [144, 151], tipo: "data" },
        hora_geracao: { pos: [152, 157], tipo: "time" },
        filler_zeros_158_166: { pos: [158, 166], tipo: "num" }, // Zeros (9)
        densidade_gravacao: { pos: [167, 171], tipo: "num" },
        uso_empresa_docto: { pos: [172, 240], tipo: "alfa" }, // Brancos / Uso Empresa
    },

    // === REGISTROS DE LOTE (Variam por Serviço) ===
    // Header Lote - Pagamentos Cheque, OP, DOC, TED, PIX Tx, Crédito CC (Pg 14)
    header_lote_cheque_etc: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" },
        tipo_registro: { pos: [8, 8], tipo: "num" }, // 1
        tipo_operacao: { pos: [9, 9], tipo: "alfa" }, // C=Crédito
        tipo_servico: { pos: [10, 11], tipo: "num" }, // NOTA 4
        forma_pagamento: { pos: [12, 13], tipo: "num" }, // NOTA 5
        layout_lote: { pos: [14, 16], tipo: "num" }, // 040
        filler_017_017: { pos: [17, 17], tipo: "alfa" },
        tipo_inscricao: { pos: [18, 18], tipo: "num" },
        numero_inscricao: { pos: [19, 32], tipo: "num" },
        identificacao_lancamento_favorecido: { pos: [33, 36], tipo: "alfa" }, // NOTA 13
        filler_037_052: { pos: [37, 52], tipo: "alfa" }, // Brancos
        agencia: { pos: [53, 57], tipo: "num" },
        filler_058_058: { pos: [58, 58], tipo: "alfa" },
        conta: { pos: [59, 70], tipo: "num" },
        filler_071_071: { pos: [71, 71], tipo: "alfa" },
        dac: { pos: [72, 72], tipo: "num" },
        nome_empresa: { pos: [73, 102], tipo: "alfa" },
        finalidade_lote: { pos: [103, 132], tipo: "alfa" }, // NOTA 6
        historico_cc: { pos: [133, 142], tipo: "alfa" }, // NOTA 7
        endereco_empresa: { pos: [143, 172], tipo: "alfa" },
        numero_endereco: { pos: [173, 177], tipo: "num" },
        complemento_endereco: { pos: [178, 192], tipo: "alfa" },
        cidade: { pos: [193, 212], tipo: "alfa" },
        cep: { pos: [213, 220], tipo: "num" }, // 8 digitos
        estado: { pos: [221, 222], tipo: "alfa" },
        filler_223_230: { pos: [223, 230], tipo: "alfa" }, // Brancos
        ocorrencias: { pos: [231, 240], tipo: "alfa" }, // NOTA 8
    },
    // Segmento A - Pagamentos Cheque, OP, DOC, TED, PIX Tx, Crédito CC (Pg 16)
    detalhe_segmento_a_cheque_etc: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" },
        tipo_registro: { pos: [8, 8], tipo: "num" }, // 3
        numero_registro: { pos: [9, 13], tipo: "num" },
        segmento: { pos: [14, 14], tipo: "alfa" }, // 'A'
        tipo_movimento: { pos: [15, 17], tipo: "num" }, // NOTA 10 (3 digitos)
        codigo_camara: { pos: [18, 20], tipo: "num" }, // NOTA 35
        codigo_banco_favorecido: { pos: [21, 23], tipo: "num" },
        agencia_conta_favorecido: { pos: [24, 43], tipo: "alfa" }, // NOTA 11 (Ag+Conta+DAC)
        nome_favorecido: { pos: [44, 73], tipo: "alfa" }, // NOTA 34
        seu_numero: { pos: [74, 93], tipo: "alfa" }, // NOTA 43
        data_pagto: { pos: [94, 101], tipo: "data" },
        moeda_tipo: { pos: [102, 104], tipo: "alfa" }, // REA ou 009
        codigo_ispb: { pos: [105, 112], tipo: "num" }, // NOTA 35 (8 digitos)
        identif_tx_pix: { pos: [113, 114], tipo: "alfa" }, // NOTA 36
        filler_zeros_115_119: { pos: [115, 119], tipo: "num" }, // Zeros
        valor_pagto: { pos: [120, 134], tipo: "decimal", casas: 2 },
        nosso_numero: { pos: [135, 149], tipo: "alfa" }, // NOTA 12 (15 chars)
        filler_brancos_150_154: { pos: [150, 154], tipo: "alfa" }, // NOTA 42
        data_efetiva: { pos: [155, 162], tipo: "data" },
        valor_efetivo: { pos: [163, 177], tipo: "decimal", casas: 2 },
        finalidade_detalhe: { pos: [178, 197], tipo: "alfa" }, // NOTA 13
        num_doc_retorno: { pos: [198, 203], tipo: "num" }, // NOTA 14 (6 digitos)
        num_inscricao_favorecido: { pos: [204, 217], tipo: "num" }, // NOTA 15 (14 digitos)
        finalidade_doc_status_funcionario: { pos: [218, 219], tipo: "alfa" }, // NOTA 30
        finalidade_ted: { pos: [220, 224], tipo: "alfa" }, // NOTA 26
        filler_brancos_225_229: { pos: [225, 229], tipo: "alfa" }, // NOTA 44
        aviso: { pos: [230, 230], tipo: "alfa" }, // NOTA 16
        ocorrencias: { pos: [231, 240], tipo: "alfa" }, // NOTA 8
    },
    // Segmento B - Pagamentos Cheque, OP, DOC, TED, Crédito CC (Opcional) (Pg 20)
    detalhe_segmento_b_cheque_etc: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" },
        tipo_registro: { pos: [8, 8], tipo: "num" }, // 3
        numero_registro: { pos: [9, 13], tipo: "num" },
        segmento: { pos: [14, 14], tipo: "alfa" }, // 'B'
        filler_brancos_015_017: { pos: [15, 17], tipo: "alfa" },
        tipo_inscricao_favorecido: { pos: [18, 18], tipo: "num" },
        numero_inscricao_favorecido: { pos: [19, 32], tipo: "num" }, // NOTA 15
        endereco_favorecido: { pos: [33, 62], tipo: "alfa" },
        numero_endereco_favorecido: { pos: [63, 67], tipo: "num" },
        complemento_endereco_favorecido: { pos: [68, 82], tipo: "alfa" },
        bairro_favorecido: { pos: [83, 97], tipo: "alfa" },
        cidade_favorecido: { pos: [98, 117], tipo: "alfa" },
        cep_favorecido: { pos: [118, 125], tipo: "num" }, // 8 digitos
        estado_favorecido: { pos: [126, 127], tipo: "alfa" },
        email_favorecido: { pos: [128, 227], tipo: "alfa" }, // NOTA 23 (100 chars)
        filler_brancos_228_230: { pos: [228, 230], tipo: "alfa" },
        ocorrencias: { pos: [231, 240], tipo: "alfa" }, // NOTA 8
    },
    // Segmento B - PIX Transferência (Obrigatório) (Pg 22)
    detalhe_segmento_b_pix: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" },
        tipo_registro: { pos: [8, 8], tipo: "num" }, // 3
        numero_registro: { pos: [9, 13], tipo: "num" },
        segmento: { pos: [14, 14], tipo: "alfa" }, // 'B'
        tipo_chave: { pos: [15, 16], tipo: "alfa" }, // NOTA 37 (2 chars)
        filler_brancos_017_017: { pos: [17, 17], tipo: "alfa" },
        tipo_inscricao_favorecido: { pos: [18, 18], tipo: "num" },
        numero_inscricao_favorecido: { pos: [19, 32], tipo: "num" }, // NOTA 15
        info_entre_usuarios: { pos: [63, 127], tipo: "alfa" }, // NOTA 39 (65 chars)
        chave_pix: { pos: [128, 227], tipo: "alfa" }, // NOTA 40 (100 chars)
        filler_brancos_228_230: { pos: [228, 230], tipo: "alfa" },
        ocorrencias: { pos: [231, 240], tipo: "alfa" }, // NOTA 8
    },
    // Segmento C - Pagamentos Cheque, OP, DOC, TED, Crédito CC (Opcional) (Pg 23)
    detalhe_segmento_c_cheque_etc: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" },
        tipo_registro: { pos: [8, 8], tipo: "num" }, // 3
        numero_registro: { pos: [9, 13], tipo: "num" },
        segmento: { pos: [14, 14], tipo: "alfa" }, // 'C'
        valor_csll: { pos: [15, 29], tipo: "decimal", casas: 2 },
        filler_brancos_030_037: { pos: [30, 37], tipo: "alfa" },
        vencimento: { pos: [38, 45], tipo: "data" }, // DDMMAAAA
        valor_documento: { pos: [46, 60], tipo: "decimal", casas: 2 },
        valor_pis: { pos: [61, 75], tipo: "decimal", casas: 2 },
        valor_ir: { pos: [76, 90], tipo: "decimal", casas: 2 },
        valor_iss: { pos: [91, 105], tipo: "decimal", casas: 2 },
        valor_cofins: { pos: [106, 120], tipo: "decimal", casas: 2 },
        desconto: { pos: [121, 135], tipo: "decimal", casas: 2 },
        abatimento: { pos: [136, 150], tipo: "decimal", casas: 2 },
        outras_deducoes: { pos: [151, 165], tipo: "decimal", casas: 2 },
        mora: { pos: [166, 180], tipo: "decimal", casas: 2 },
        multa: { pos: [181, 195], tipo: "decimal", casas: 2 },
        outros_acrescimos: { pos: [196, 210], tipo: "decimal", casas: 2 },
        fatura_documento: { pos: [211, 230], tipo: "alfa" },
        filler_brancos_231_240: { pos: [231, 240], tipo: "alfa" },
    },
    // Segmento D - Salários Holerite (Opcional) (Pg 24)
    detalhe_segmento_d_salario: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" },
        tipo_registro: { pos: [8, 8], tipo: "num" },
        segmento: { pos: [14, 14], tipo: "alfa" }, // 'D'
        filler_brancos_015_017: { pos: [15, 17], tipo: "alfa" },
        periodo_competencia: { pos: [18, 23], tipo: "data" },
        centro_custro: { pos: [24, 38], tipo: "alfa" },
        codigo_funcionario: { pos: [39, 53], tipo: "alfa" },
        cargo_funcionario: { pos: [54, 83], tipo: "alfa" },
        periodo_ferias_de: { pos: [84, 91], tipo: "data" },
        periodo_ferias_ate: { pos: [92, 99], tipo: "data" },
        quantidade_dependentes_imp_renda: { pos: [100, 101], tipo: "num" },
        quantidade_dependentes_sal_familia: { pos: [102, 103], tipo: "num" },
        horas_semanais: { pos: [104, 105], tipo: "num" },
        salario_contribuicao: { pos: [106, 120], tipo: "decimal", casas: 2 },
        fgts: { pos: [121, 135], tipo: "decimal", casas: 2 },
        valor_total_creditos: { pos: [136, 150], tipo: "decimal", casas: 2 },
        valor_total_debito: { pos: [151, 165], tipo: "decimal", casas: 2 },
        valor_total_liquido: { pos: [166, 180], tipo: "decimal", casas: 2 },
        valor_salario_fixo: { pos: [181, 195], tipo: "decimal", casas: 2 },
        valor_base_irrf: { pos: [196, 210], tipo: "decimal", casas: 2 },
        disponibilizacao_holerite: { pos: [226, 227], tipo: "alfa" },
        filler_brancos_228_230: { pos: [228, 230], tipo: "alfa" },
        ocorrencias: { pos: [231, 240], tipo: "alfa" },
    },
    // Segmento E - Salários Holerite (Opcional) (Pg 26)
    detalhe_segmento_e_salario: { /* ... Definição da Pg 26 ... */ },
    // Segmento F - Salários Holerite (Opcional) (Pg 27)
    detalhe_segmento_f_salario: { /* ... Definição da Pg 27 ... */ },
    // Segmento Z - Pagamentos Cheque, OP, DOC, TED, PIX Tx, Crédito CC (Opcional Retorno) (Pg 28)
    detalhe_segmento_z_cheque_etc: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" },
        tipo_registro: { pos: [8, 8], tipo: "num" }, // 3
        numero_registro: { pos: [9, 13], tipo: "num" },
        segmento: { pos: [14, 14], tipo: "alfa" }, // 'Z'
        autenticacao: { pos: [15, 78], tipo: "alfa" }, // 64 chars
        seu_numero_z: { pos: [79, 98], tipo: "alfa" }, // NOTA 43 (20 chars)
        filler_brancos_099_103: { pos: [99, 103], tipo: "alfa" },
        nosso_numero_z: { pos: [104, 118], tipo: "alfa" }, // 15 chars
        filler_brancos_119_240: { pos: [119, 240], tipo: "alfa" },
    },
    // Trailer Lote - Pagamentos Cheque, OP, DOC, TED, PIX Tx, Crédito CC (Pg 29)
    trailer_lote_cheque_etc: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" },
        tipo_registro: { pos: [8, 8], tipo: "num" }, // 5
        filler_brancos_009_017: { pos: [9, 17], tipo: "alfa" },
        total_qtde_registros: { pos: [18, 23], tipo: "num" }, // NOTA 17
        total_valor_pagtos: { pos: [24, 41], tipo: "decimal", casas: 2 }, // NOTA 17
        filler_zeros_042_059: { pos: [42, 59], tipo: "num" }, // Zeros (18)
        filler_brancos_060_230: { pos: [60, 230], tipo: "alfa" },
        ocorrencias: { pos: [231, 240], tipo: "alfa" }, // NOTA 8
    },

    // Header Lote - Liquidação Títulos (Boletos), PIX QR Code (Pg 30)
    header_lote_boleto_pixqr: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" },
        tipo_registro: { pos: [8, 8], tipo: "num" }, // 1
        tipo_operacao: { pos: [9, 9], tipo: "alfa" }, // C=Crédito
        tipo_servico: { pos: [10, 11], tipo: "num" }, // NOTA 4
        forma_pagamento: { pos: [12, 13], tipo: "num" }, // NOTA 5
        layout_lote: { pos: [14, 16], tipo: "num" }, // 030
        filler_017_017: { pos: [17, 17], tipo: "alfa" },
        tipo_inscricao: { pos: [18, 18], tipo: "num" },
        numero_inscricao: { pos: [19, 32], tipo: "num" },
        filler_032_052: { pos: [32, 52], tipo: "alfa" }, // Brancos
        agencia: { pos: [53, 57], tipo: "num" },
        filler_058_058: { pos: [58, 58], tipo: "alfa" },
        conta: { pos: [59, 70], tipo: "num" },
        filler_071_071: { pos: [71, 71], tipo: "alfa" },
        dac: { pos: [72, 72], tipo: "num" },
        nome_empresa: { pos: [73, 102], tipo: "alfa" },
        finalidade_lote: { pos: [103, 132], tipo: "alfa" }, // NOTA 6
        historico_cc: { pos: [133, 142], tipo: "alfa" }, // NOTA 7
        endereco_empresa: { pos: [143, 172], tipo: "alfa" },
        numero_endereco: { pos: [173, 177], tipo: "num" },
        complemento_endereco: { pos: [178, 192], tipo: "alfa" },
        cidade: { pos: [193, 212], tipo: "alfa" },
        cep: { pos: [213, 220], tipo: "num" }, // 8 digitos
        estado: { pos: [221, 222], tipo: "alfa" },
        filler_223_230: { pos: [223, 230], tipo: "alfa" }, // Brancos
        ocorrencias: { pos: [231, 240], tipo: "alfa" }, // NOTA 8
    },
    // Segmento J - Liquidação Títulos (Boletos), PIX QR Code (Pg 31)
    detalhe_segmento_j_boleto_pixqr: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" },
        tipo_registro: { pos: [8, 8], tipo: "num" }, // 3
        numero_registro: { pos: [9, 13], tipo: "num" },
        segmento: { pos: [14, 14], tipo: "alfa" }, // 'J'
        tipo_movimento: { pos: [15, 17], tipo: "num" }, // NOTA 10 (3 digitos)
        cod_barras_banco_fav: { pos: [18, 20], tipo: "num" }, // NOTA 18
        cod_barras_moeda: { pos: [21, 21], tipo: "num" }, // NOTA 18
        cod_barras_dv: { pos: [22, 22], tipo: "num" }, // NOTA 18
        cod_barras_fator_venc: { pos: [23, 26], tipo: "num" }, // NOTA 18
        cod_barras_valor: { pos: [27, 36], tipo: "decimal", casas: 2 }, // NOTA 18 (10 digitos)
        cod_barras_campo_livre: { pos: [37, 61], tipo: "num" }, // NOTA 18 (25 digitos)
        nome_favorecido: { pos: [62, 91], tipo: "alfa" },
        data_vencto_nominal: { pos: [92, 99], tipo: "data" },
        valor_titulo_nominal: { pos: [100, 114], tipo: "decimal", casas: 2 },
        valor_desconto_abatimento: { pos: [115, 129], tipo: "decimal", casas: 2 },
        valor_mora_multa: { pos: [130, 144], tipo: "decimal", casas: 2 },
        data_pagamento: { pos: [145, 152], tipo: "data" },
        valor_pagamento: { pos: [153, 167], tipo: "decimal", casas: 2 },
        filler_zeros_168_182: { pos: [168, 182], tipo: "num" }, // Zeros (15)
        seu_numero: { pos: [183, 202], tipo: "alfa" }, // NOTA 43
        filler_brancos_203_215: { pos: [203, 215], tipo: "alfa" },
        nosso_numero: { pos: [216, 230], tipo: "alfa" }, // NOTA 12 (15 chars)
        ocorrencias: { pos: [231, 240], tipo: "alfa" }, // NOTA 8
    },
    // Segmento J-52 - Liquidação Títulos (Boletos) (Pg 32)
    detalhe_segmento_j52_boleto_pixqr: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" },
        tipo_registro: { pos: [8, 8], tipo: "num" }, // 3
        numero_registro: { pos: [9, 13], tipo: "num" },
        segmento: { pos: [14, 14], tipo: "alfa" }, // 'J'
        tipo_movimento: { pos: [15, 17], tipo: "num" }, // NOTA 10
        codigo_registro_opcional: { pos: [18, 19], tipo: "num" }, // '52'
        tipo_inscricao_sacado: { pos: [20, 20], tipo: "num" },
        numero_inscricao_sacado: { pos: [21, 35], tipo: "num" }, // 15 posições
        nome_sacado: { pos: [36, 75], tipo: "alfa" },
        tipo_inscricao_cedente: { pos: [76, 76], tipo: "num" },
        numero_inscricao_cedente: { pos: [77, 91], tipo: "num" }, // 15 posições
        nome_cedente: { pos: [92, 131], tipo: "alfa" },
        tipo_inscricao_sacador_avalista: { pos: [132, 132], tipo: "num" },
        numero_inscricao_sacador_avalista: { pos: [133, 147], tipo: "num" }, // 15 posições
        nome_sacador_avalista: { pos: [148, 187], tipo: "alfa" },
        filler_brancos_188_240: { pos: [188, 240], tipo: "alfa" } // Brancos (53)
    },
    // Segmento J-52 PIX - Liquidação PIX QR Code (Pg 33)
    detalhe_segmento_j52_pix: { /* ... Definição da Pg 33 ... */ },
    // Segmento B - Liquidação Títulos (Boletos) (Opcional) (Pg 34)
    detalhe_segmento_b_boleto_pixqr: { /* ... Definição da Pg 34 (similar a Pg 20) ... */ },
    // Segmento C - Liquidação Títulos (Boletos) (Opcional) (Pg 35)
    detalhe_segmento_c_boleto_pixqr: { /* ... Definição da Pg 35 (similar a Pg 23) ... */ },
    // Segmento Z - Liquidação Títulos (Boletos), PIX QR Code (Opcional Retorno) (Pg 36)
    detalhe_segmento_z_boleto_pixqr: { /* ... Definição da Pg 36 (similar a Pg 28) ... */ },
    // Trailer Lote - Liquidação Títulos (Boletos), PIX QR Code (Pg 38)
    trailer_lote_boleto_pixqr: { /* ... Definição da Pg 38 (similar a Pg 29) ... */ },

    // Header Lote - Concessionárias/Tributos CB (Pg 39)
    header_lote_concessionaria_cb: { /* ... Definição da Pg 39 (similar a Pg 14/30) ... */ },
    // Segmento O - Concessionárias/Tributos CB (Pg 40)
    detalhe_segmento_o_concessionaria_cb: { /* ... Definição da Pg 40 ... */ },
    // Segmento Z - Concessionárias/Tributos CB (Opcional Retorno) (Pg 41)
    detalhe_segmento_z_concessionaria_cb: { /* ... Definição da Pg 41 (similar a Pg 28/36) ... */ },
    // Trailer Lote - Concessionárias/Tributos CB (Pg 42)
    trailer_lote_concessionaria_cb: { /* ... Definição da Pg 42 ... */ },

    // Header Lote - Tributos SB/FGTS (Pg 43)
    header_lote_tributo_sb_fgts: { /* ... Definição da Pg 43 (similar a Pg 14/30/39) ... */ },
    // Segmento N - Tributos SB/FGTS (Pg 44)
    detalhe_segmento_n_tributo_sb_fgts: { /* ... Definição da Pg 44 ... */ },
    // Segmento B - Tributos SB/FGTS (Opcional) (Pg 45)
    detalhe_segmento_b_tributo_sb_fgts: { /* ... Definição da Pg 45 ... */ },
    // Segmento W - GARE SP (Opcional) (Pg 46)
    detalhe_segmento_w_gare: { /* ... Definição da Pg 46 ... */ },
    // Segmento Z - Tributos SB/FGTS (Opcional Retorno) (Pg 47)
    detalhe_segmento_z_tributo_sb_fgts: { /* ... Definição da Pg 47 (similar a Pg 28/36/41) ... */ },
    // Trailer Lote - Tributos SB/FGTS (Pg 48)
    trailer_lote_tributo_sb_fgts: { /* ... Definição da Pg 48 ... */ },

    // === REGISTRO TRAILER DE ARQUIVO (Pg 49) ===
    trailer_arquivo: {
        codigo_banco: { pos: [1, 3], tipo: "num" },
        lote_servico: { pos: [4, 7], tipo: "num" }, // 9999
        tipo_registro: { pos: [8, 8], tipo: "num" }, // 9
        filler_brancos_009_017: { pos: [9, 17], tipo: "alfa" },
        quantidade_lotes_arquivo: { pos: [18, 23], tipo: "num" }, // NOTA 17
        quantidade_registros_arquivo: { pos: [24, 29], tipo: "num" }, // NOTA 17
        filler_brancos_030_240: { pos: [30, 240], tipo: "alfa" }, // Ajustado (Manual pg 49 mostra 6 qtd contas, mas isso é p/ Extrato)
    },
}; // --- Fim itauSispagLayout ---