export const baseFebrabanLayout = {
    // --- REGISTRO HEADER DE ARQUIVO (FEBRABAN V10.11 - Pg 17) ---
    header_arquivo: {
        codigo_banco_compensacao: { pos: [1, 3], tipo: "num" },        // G001
        lote_servico: { pos: [4, 7], tipo: "num" },                  // G002
        tipo_registro: { pos: [8, 8], tipo: "num" },                 // G003
        uso_exclusivo_febraban_cnab_1: { pos: [9, 17], tipo: "alfa" }, // G004
        tipo_inscricao_empresa: { pos: [18, 18], tipo: "num" },       // G005
        numero_inscricao_empresa: { pos: [19, 32], tipo: "num" },     // G006
        codigo_convenio_banco: { pos: [33, 52], tipo: "alfa" },       // G007
        agencia_mantenedora_conta: { pos: [53, 57], tipo: "num" },    // G008
        dv_agencia: { pos: [58, 58], tipo: "alfa" },                 // G009
        numero_conta_corrente: { pos: [59, 70], tipo: "num" },        // G010
        dv_conta: { pos: [71, 71], tipo: "alfa" },                   // G011
        dv_agencia_conta: { pos: [72, 72], tipo: "alfa" },            // G012
        nome_empresa: { pos: [73, 102], tipo: "alfa" },               // G013
        nome_banco: { pos: [103, 132], tipo: "alfa" },               // G014
        uso_exclusivo_febraban_cnab_2: { pos: [133, 142], tipo: "alfa" },// G004
        codigo_remessa_retorno: { pos: [143, 143], tipo: "num" },     // G015
        data_geracao_arquivo: { pos: [144, 151], tipo: "data" },      // G016
        hora_geracao_arquivo: { pos: [152, 157], tipo: "time" },      // G017
        numero_sequencial_arquivo: { pos: [158, 163], tipo: "num" },  // G018
        numero_versao_layout_arquivo: { pos: [164, 166], tipo: "num" },// G019
        densidade_gravacao_arquivo: { pos: [167, 171], tipo: "num" }, // G020
        para_uso_reservado_banco: { pos: [172, 191], tipo: "alfa" },  // G021
        para_uso_reservado_empresa: { pos: [192, 211], tipo: "alfa" },// G022
        uso_exclusivo_febraban_cnab_3: { pos: [212, 240], tipo: "alfa" },// G004
    },

    // --- REGISTRO HEADER DE LOTE (FEBRABAN V10.11 - Genérico, ex: Pagamentos Pg 24) ---
    header_lote: {
        codigo_banco_compensacao: { pos: [1, 3], tipo: "num" },        // G001
        lote_servico: { pos: [4, 7], tipo: "num" },                  // G002
        tipo_registro: { pos: [8, 8], tipo: "num" },                 // G003
        tipo_operacao: { pos: [9, 9], tipo: "alfa" },                // G028
        tipo_servico: { pos: [10, 11], tipo: "num" },                // G025
        forma_lancamento: { pos: [12, 13], tipo: "num" },            // G029 (Pode variar por serviço)
        numero_versao_layout_lote: { pos: [14, 16], tipo: "num" },   // G030
        uso_exclusivo_febraban_cnab_1: { pos: [17, 17], tipo: "alfa" },// G004
        tipo_inscricao_empresa: { pos: [18, 18], tipo: "num" },       // G005
        numero_inscricao_empresa: { pos: [19, 32], tipo: "num" },     // G006
        codigo_convenio_banco: { pos: [33, 52], tipo: "alfa" },       // G007 (Pode ser específico do serviço)
        agencia_mantenedora_conta: { pos: [53, 57], tipo: "num" },    // G008
        dv_agencia: { pos: [58, 58], tipo: "alfa" },                 // G009
        numero_conta_corrente: { pos: [59, 70], tipo: "num" },        // G010
        dv_conta: { pos: [71, 71], tipo: "alfa" },                   // G011
        dv_agencia_conta: { pos: [72, 72], tipo: "alfa" },            // G012
        nome_empresa: { pos: [73, 102], tipo: "alfa" },               // G013
        mensagem_1: { pos: [103, 142], tipo: "alfa" },                // G031 (Informação 1)
        endereco_empresa_logradouro: { pos: [143, 172], tipo: "alfa" },// G032
        numero_endereco: { pos: [173, 177], tipo: "num" },            // G032
        complemento_endereco: { pos: [178, 192], tipo: "alfa" },      // G032
        cidade: { pos: [193, 212], tipo: "alfa" },                   // G033
        cep: { pos: [213, 217], tipo: "num" },                       // G034 (5 digitos)
        complemento_cep: { pos: [218, 220], tipo: "alfa" },          // G035 (3 digitos)
        estado_uf: { pos: [221, 222], tipo: "alfa" },                // G036
        indicativo_forma_pagamento: { pos: [223, 224], tipo: "num" }, // P014
        uso_exclusivo_febraban_cnab_2: { pos: [225, 230], tipo: "alfa" },// G004
        ocorrencias: { pos: [231, 240], tipo: "alfa", retorno: true}, // G059
    },

    // --- REGISTROS DETALHE - SEGMENTOS (FEBRABAN V10.11) ---
    detalhe_segmento_a: {
        codigo_banco_compensacao: { pos: [1, 3], tipo: "num" },    // G001
        lote_servico: { pos: [4, 7], tipo: "num" },              // G002
        tipo_registro: { pos: [8, 8], tipo: "num" },             // G003
        numero_sequencial_registro_lote: { pos: [9, 13], tipo: "num" },// G038
        codigo_segmento_registro_detalhe: { pos: [14, 14], tipo: "alfa" },// G039
        tipo_movimento: { pos: [15, 15], tipo: "num" },          // G060
        codigo_instrucao_movimento: { pos: [16, 17], tipo: "num" },// G061
        codigo_camara_centralizadora: { pos: [18, 20], tipo: "num" },// P001
        codigo_banco_favorecido: { pos: [21, 23], tipo: "num" },  // P002
        agencia_mantenedora_cta_favor: { pos: [24, 28], tipo: "num" },// G008
        dv_agencia_favor: { pos: [29, 29], tipo: "alfa" },       // G009
        numero_conta_corrente_favor: { pos: [30, 41], tipo: "num" },// G010
        dv_conta_favor: { pos: [42, 42], tipo: "alfa" },         // G011
        dv_agencia_conta_favor: { pos: [43, 43], tipo: "alfa" },  // G012
        nome_favorecido: { pos: [44, 73], tipo: "alfa" },         // G013
        numero_doc_atrib_empresa: { pos: [74, 93], tipo: "alfa" },// G064
        data_pagamento: { pos: [94, 101], tipo: "data" },        // P009 (Num DDMMAAAA)
        tipo_moeda: { pos: [102, 104], tipo: "alfa" },           // G040
        quantidade_moeda: { pos: [105, 119], tipo: "decimal", casas: 5 },// G041
        valor_pagamento: { pos: [120, 134], tipo: "decimal", casas: 2 },// P010
        numero_doc_atrib_banco: { pos: [135, 154], tipo: "alfa" },// G043 (Nosso Número)
        data_real_efetivacao_pagto: { pos: [155, 162], tipo: "data" },// P003 (Num DDMMAAAA)
        valor_real_efetivacao_pagto: { pos: [163, 177], tipo: "decimal", casas: 2 },// P004
        outras_informacoes: { pos: [178, 217], tipo: "alfa" },    // G031 (Informação 2)
        compl_tipo_servico: { pos: [218, 219], tipo: "alfa" },    // P005
        codigo_finalidade_ted: { pos: [220, 224], tipo: "alfa" }, // P011
        compl_finalidade_pagto: { pos: [225, 226], tipo: "alfa" },// P013
        uso_exclusivo_febraban_cnab_seg_a: { pos: [227, 229], tipo: "alfa" },// G004
        aviso_ao_favorecido: { pos: [230, 230], tipo: "num" },    // P006
        ocorrencias_retorno: { pos: [231, 240], tipo: "alfa" },   // G059
    },
    detalhe_segmento_j: { /* ... Definição do Segmento J FEBRABAN (Pg 30) ... */ },
    detalhe_segmento_j52: { /* ... Definição do Segmento J-52 FEBRABAN (Pg 31) ... */ },

    // --- REGISTRO TRAILER DE LOTE (FEBRABAN V10.11 - Genérico, ex: Pagamentos Pg 28) ---
    trailer_lote: {
        codigo_banco_compensacao: { pos: [1, 3], tipo: "num" },    // G001
        lote_servico: { pos: [4, 7], tipo: "num" },              // G002
        tipo_registro: { pos: [8, 8], tipo: "num" },             // G003 (Default '5')
        uso_exclusivo_febraban_cnab_1: { pos: [9, 17], tipo: "alfa" },// G004
        quantidade_registros_lote: { pos: [18, 23], tipo: "num" },// G057
        somatoria_valores: { pos: [24, 41], tipo: "decimal", casas: 2 }, // P007 (Significado varia com serviço)
        somatoria_quantidade_moedas: { pos: [42, 59], tipo: "decimal", casas: 5 },// G058 (Significado varia com serviço)
        numero_aviso_debito: { pos: [60, 65], tipo: "num" },      // G066
        uso_exclusivo_febraban_cnab_2: { pos: [66, 230], tipo: "alfa" },// G004
        ocorrencias: { pos: [231, 240], tipo: "alfa", retorno: true }, // G059
    },

    // --- REGISTRO TRAILER DE ARQUIVO (FEBRABAN V10.11 - Pg 18) ---
    trailer_arquivo: {
        codigo_banco_compensacao: { pos: [1, 3], tipo: "num" },    // G001
        lote_servico: { pos: [4, 7], tipo: "num" },              // G002
        tipo_registro: { pos: [8, 8], tipo: "num" },             // G003
        uso_exclusivo_febraban_cnab_1: { pos: [9, 17], tipo: "alfa" },// G004
        quantidade_lotes_arquivo: { pos: [18, 23], tipo: "num" }, // G049
        quantidade_registros_arquivo: { pos: [24, 29], tipo: "num" },// G056
        qtde_contas_concil_lotes: { pos: [30, 35], tipo: "num" },  // G037 (Para Extrato Conciliação)
        uso_exclusivo_febraban_cnab_2: { pos: [36, 240], tipo: "alfa" },// G004
    },
};
