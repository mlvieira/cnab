export const labels = {
  // --- General & Common Fields ---
  codigo_banco: "Código do Banco",
  nome_banco: "Nome do Banco",
  lote_servico: "Lote de Serviço",
  tipo_registro: "Tipo de Registro",
  numero_registro: "Número do Registro",
  segmento: "Segmento",
  tipo_inscricao: "Tipo Inscrição",
  numero_inscricao: "Número Inscrição",
  nome_empresa: "Nome da Empresa",
  agencia: "Agência",
  digito_agencia: "Dígito Agência",
  conta: "Conta",
  digito_conta: "Dígito Conta",
  digito_ag_conta: "Dígito Ag/Conta",
  codigo_convenio: "Código Convênio",
  ocorrencias: "Ocorrências",
  quantidade_registros: "Qtd. Registros",
  quantidade_lotes: "Qtd. Lotes",
  quantidade_contas_conciliadas: "Qtd. Contas Concil.",
  somatoria_valores: "Somatória Valores",
  somatoria_quantidade_moedas: "Somatória Qtd. Moedas",
  valor: "Valor", // Generic value, often overridden by more specific below
  data_pagamento: "Data Pagamento",
  data_vencimento: "Data Vencimento",
  valor_pagamento: "Valor Pagamento",
  valor_titulo: "Valor Título",
  nosso_numero: "Nosso Número",
  numero_documento: "Número Documento",
  codigo_movimento: "Código Movimento",
  tipo_movimento: "Tipo Movimento",
  nome_favorecido: "Nome Favorecido",
  nome_pagador: "Nome Pagador",
  nome_beneficiario: "Nome Beneficiário",
  nome_sacador: "Nome Sacador/Avalista",
  tipo_inscricao_favorecido: "Tipo Inscrição Favorecido",
  numero_inscricao_favorecido: "Número Inscrição Favorecido",
  tipo_inscricao_pagador: "Tipo Inscrição Pagador",
  numero_inscricao_pagador: "Número Inscrição Pagador",
  tipo_inscricao_beneficiario: "Tipo Inscrição Beneficiário",
  numero_inscricao_beneficiario: "Número Inscrição Beneficiário",
  tipo_inscricao_sacador: "Tipo Inscrição Sacador/Avalista",
  numero_inscricao_sacador: "Número Inscrição Sacador/Avalista",
  logradouro: "Logradouro",
  numero: "Número End.",
  complemento: "Complemento End.",
  bairro: "Bairro",
  cidade: "Cidade",
  estado: "UF",
  cep: "CEP",
  complemento_cep: "Compl. CEP",
  endereco_logradouro: "Logradouro Fav.", // Segment B specific? Check usage
  endereco_numero: "Número End. Fav.", // Segment B specific? Check usage
  endereco_complemento: "Complemento End. Fav.", // Segment B specific? Check usage
  endereco_bairro: "Bairro Fav.", // Segment B specific? Check usage
  endereco_cidade: "Cidade Fav.", // Segment B specific? Check usage
  endereco_cep: "CEP Fav.", // Segment B specific? Check usage
  endereco_complemento_cep: "Compl. CEP Fav.", // Segment B specific? Check usage
  endereco_estado: "UF Fav.", // Segment B specific? Check usage
  valor_desconto: "Valor Desconto",
  valor_multa: "Valor Multa",
  valor_abatimento: "Valor Abatimento",
  valor_mora: "Valor Mora",
  valor_juros: "Valor/Taxa Juros",
  valor_iof: "Valor IOF",
  codigo_moeda: "Código Moeda",
  quantidade_moeda: "Qtd. Moeda",
  aviso_favorecido: "Aviso Favorecido",

  // --- Header Arquivo Specific ---
  codigo_remessa: "Código Remessa/Retorno",
  data_geracao: "Data Geração",
  hora_geracao: "Hora Geração",
  numero_sequencial: "Num. Seq. Arquivo",
  versao_layout: "Versão Layout Arq.",
  densidade_gravacao: "Densidade Gravação",

  // --- Header Lote Specific ---
  tipo_operacao: "Tipo Operação",
  tipo_servico: "Tipo Serviço",
  versao_layout_lote: "Versão Layout Lote",
  mensagem: "Mensagem 1",

  // --- Segmento A Specific ---
  codigo_camara: "Código Câmara Comp.",
  codigo_banco_favorecido: "Banco Favorecido",
  agencia_favorecido: "Agência Favorecido",
  digito_agencia_favorecido: "Dígito Ag. Fav.",
  conta_favorecido: "Conta Favorecido",
  digito_conta_favorecido: "Dígito Conta Fav.",
  digito_ag_conta_favorecido: "Dígito Ag/Conta Fav.",
  tipo_moeda: "Tipo Moeda", // Often 'BRL'
  data_real_pagamento: "Data Real Pagamento",
  valor_real_pagamento: "Valor Real Pagamento",
  informacao_complementar: "Informação Comp. (Histórico)",
  complemento_finalidade: "Compl. Finalidade (SPB)",
  finalidade_ted: "Finalidade TED",
  finalidade_doc: "Finalidade DOC/Salário",

   // --- Segmento B Specific ---
   valor_documento: "Valor Documento",
   codigo_documento_favorecido: "Cód. Doc. Favorecido (TED/DOC)",
   codigo_ug_centralizadora: "Cód. UG Centralizadora (SIAFI)",

   // --- Segmento C Specific ---
   valor_ir: "Valor IR",
   valor_iss: "Valor ISS",
   valor_outras_deducoes: "Valor Outras Deduções",
   valor_outros_acrescimos: "Valor Outros Acréscimos",
   agencia_favorecido_rateio: "Ag. Rateio",
   digito_agencia_favorecido_rateio: "DV Ag. Rateio",
   conta_favorecido_rateio: "Conta Rateio",
   digito_conta_favorecido_rateio: "DV Conta Rateio",
   digito_ag_conta_favorecido_rateio: "DV Ag/Conta Rateio",
   valor_inss: "Valor INSS",

   // --- Segmento J Specific ---
   codigo_barras: "Código de Barras",
   valor_acrescimo: "Valor Acréscimo", // Mora + Multa
   referencia_sacado: "Referência Sacado (Seu Número)",

   // --- Segmento J52 Specific ---
   codigo_registro_opcional: "Cód. Reg. Opcional (52)",

   // --- Segmento P Specific ---
   codigo_carteira: "Código Carteira",
   cadastramento: "Cadastramento",
   documento: "Tipo Documento",
   emissao_boleto: "Emissão Boleto",
   distribuicao_boleto: "Distribuição Boleto",
   agencia_cobradora: "Agência Cobradora",
   digito_ag_cobradora: "DV Ag. Cobradora",
   especie: "Espécie Título",
   aceite: "Aceite",
   data_emissao: "Data Emissão",
   codigo_juros: "Código Juros",
   data_juros: "Data Juros",
   codigo_desconto: "Código Desconto 1", // Renamed from generic
   data_desconto: "Data Desconto 1", // Renamed from generic
   // valor_desconto is already defined as common
   uso_empresa: "Uso Empresa (Seu Número)",
   codigo_protesto: "Código Protesto",
   prazo_protesto: "Prazo Protesto",
   codigo_baixa: "Código Baixa/Devolução",
   prazo_baixa: "Prazo Baixa/Devolução",

   // --- Segmento Q Specific ---
   codigo_banco_correspondente: "Banco Correspondente",
   nosso_numero_banco_correspondente: "Nosso Num. Banco Corresp.",

   // --- Segmento R Specific ---
   codigo_desconto_2: "Código Desconto 2",
   data_desconto_2: "Data Desconto 2",
   valor_desconto_2: "Valor/Taxa Desconto 2",
   codigo_desconto_3: "Código Desconto 3",
   data_desconto_3: "Data Desconto 3",
   valor_desconto_3: "Valor/Taxa Desconto 3",
   codigo_multa: "Código Multa", // Renamed from generic
   data_multa: "Data Multa", // Renamed from generic
   // valor_multa is already defined as common
   informacao_pagador: "Informação ao Pagador",
   mensagem_3: "Mensagem 3",
   mensagem_4: "Mensagem 4",
   codigo_ocorrencia_pagador: "Cód. Ocorr. Pagador (Ret.)",
   codigo_banco_pagador: "Banco Pagador (Ret.)",
   agencia_pagador: "Agência Pagador (Ret.)",
   digito_agencia_pagador: "DV Ag. Pagador (Ret.)",
   conta_pagador: "Conta Pagador (Ret.)",
   digito_conta_pagador: "DV Conta Pagador (Ret.)",
   digito_ag_conta_pagador: "DV Ag/Conta Pagador (Ret.)",

  // --- Trailer Lote Specific ---
  numero_aviso_debito: "Num. Aviso Débito (Ret.)",

};

/**
 * Gets the human-readable label for a technical field name.
 * @param {string} fieldKey - The technical field name (e.g., 'codigo_banco').
 * @returns {string} The human-readable label or the original key if not found.
 */
export function getLabel(fieldKey) {
  return labels[fieldKey] || fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Fallback: format key
}
