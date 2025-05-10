<script>
  import { getLabel } from "./fieldLabels.js";

  export let result;

  // Reactive variables
  $: bankCode = result?.bank_code;
  $: bankName = result?.bank_name;
  $: ha = result?.header_arquivo;
  $: lotes = result?.lotes || {};
  $: ta = result?.trailer_arquivo;
  $: allWarnings = result?.warnings || [];
  $: errors = result?.errors || [];
  $: fileInfo = result?.file_info;

  // --- Warning Handling ---
  const MISSING_LAYOUT_PREFIX = "Layout definition missing for Segmento";
  $: missingLayoutWarnings = allWarnings.filter((w) =>
    w.includes(MISSING_LAYOUT_PREFIX),
  );
  $: otherWarnings = allWarnings.filter(
    (w) => !w.includes(MISSING_LAYOUT_PREFIX),
  );

  /**
   * Prepares segment data for rendering in the template's #each block.
   * @param {object} segmentData - The parsed data for a segment/record.
   * @returns {Array<object>} Array of { key, label, value, original } for rendering.
   */
  function prepareFieldsForRender(segmentData) {
    if (!segmentData || typeof segmentData !== "object") return [];
    const fields = [];
    for (const [key, value] of Object.entries(segmentData)) {
      if (key.startsWith("_")) continue; // Skip internal fields
      fields.push({
        key: key,
        label: getLabel(key), // Get human-readable label
        value: formatValue(value),
        original: segmentData[`${key}_original`],
      });
    }
    return fields;
  }

  // --- Formatting Helper ---
  function formatValue(value) {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }

  // --- Segment Type Helper ---
  function getSegmentType(key) {
    // Example: 'segmento_j', 'segmento_j52', 'segmento_a'
    const match = key.match(/^segmento_([a-z])([0-9]*)$/i);
    if (match) {
      const baseSegment = match[1].toUpperCase();
      const optionalCode = match[2];

      if (optionalCode && optionalCode !== "") {
        return `${baseSegment}${optionalCode}`;
      } else {
        return baseSegment;
      }
    }
    return key.replace("segmento_", "").toUpperCase();
  }
</script>

<div class="cnab-viewer space-y-6">
  <!-- Bank Info -->
  {#if bankCode}
    <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h4 class="text-lg font-semibold mb-2 text-blue-800">
        Informações do Banco
      </h4>
      <dl class="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
        <dt class="font-medium text-gray-500">{getLabel("codigo_banco")}:</dt>
        <dd class="text-gray-800">{bankCode}</dd>
        <dt class="font-medium text-gray-500">{getLabel("nome_banco")}:</dt>
        <dd class="text-gray-800">{bankName || "Desconhecido"}</dd>
      </dl>
    </div>
  {/if}

  <!-- File Info -->
  {#if fileInfo}
    <div class="p-4 bg-gray-50 border border-gray-200 rounded-md">
      <h4 class="text-lg font-semibold mb-2 text-gray-700">
        Informações do Arquivo
      </h4>
      <dl class="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
        <dt class="font-medium text-gray-500">Linhas Lidas:</dt>
        <dd class="text-gray-800">{fileInfo.total_lines_read}</dd>
        <dt class="font-medium text-gray-500">Linhas Não Vazias:</dt>
        <dd class="text-gray-800">{fileInfo.non_empty_lines}</dd>
        <dt class="font-medium text-gray-500">Quebra de Linha:</dt>
        <dd class="text-gray-800">{fileInfo.detected_line_ending}</dd>
        <dt class="font-medium text-gray-500">Erros Críticos:</dt>
        <dd
          class={errors.length > 0
            ? "text-red-600 font-bold"
            : "text-green-600"}
        >
          {errors.length > 0 ? `${errors.length} encontrado(s)` : "Nenhum"}
        </dd>
        <dt class="font-medium text-gray-500">Avisos:</dt>
        <dd
          class={allWarnings.length > 0
            ? "text-yellow-600 font-bold"
            : "text-green-600"}
        >
          {allWarnings.length > 0
            ? `${allWarnings.length} encontrado(s)`
            : "Nenhum"}
        </dd>
      </dl>
    </div>
  {/if}

  <!-- Critical Errors -->
  {#if errors.length > 0}
    <div class="errors p-4 bg-red-50 border border-red-300 rounded-md">
      <h4 class="text-lg font-semibold mb-2 text-red-800">
        Erros Críticos ({errors.length})
      </h4>
      <ul class="list-disc list-inside space-y-1 text-sm text-red-700">
        {#each errors as errorMsg}
          <li>{errorMsg}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- Other Warnings (Excluding Missing Layout) -->
  {#if otherWarnings.length > 0}
    <div class="warnings p-4 bg-yellow-50 border border-yellow-300 rounded-md">
      <h4 class="text-lg font-semibold mb-2 text-yellow-800">
        Avisos ({otherWarnings.length})
      </h4>
      <ul class="list-disc list-inside space-y-1 text-sm text-yellow-700">
        {#each otherWarnings as warning}
          <li>{warning}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- Missing Layout Warnings (Collapsed) -->
  {#if missingLayoutWarnings.length > 0}
    <div class="warnings p-4 bg-orange-50 border border-orange-300 rounded-md">
      <details>
        <summary class="cursor-pointer text-orange-800">
          <h4 class="text-lg font-semibold inline">
            Avisos de Layout Faltante ({missingLayoutWarnings.length})
          </h4>
          <span class="text-sm ml-2">(Clique para expandir)</span>
        </summary>
        <p class="text-xs text-orange-700 mt-2 italic">
          Estes avisos indicam que o arquivo contém segmentos (ex: G, H) que não
          estão definidos no layout atual do processador (<code class="text-xs"
            >Cnab240Processor.js</code
          >). Os dados desses segmentos foram ignorados. Para processá-los, a
          definição do layout precisa ser adicionada ou atualizada.
        </p>
        <ul
          class="list-disc list-inside space-y-1 text-sm text-orange-700 mt-2 max-h-40 overflow-y-auto"
        >
          {#each missingLayoutWarnings as warning}
            <li>{warning}</li>
          {/each}
        </ul>
      </details>
    </div>
  {/if}

  <!-- Header Arquivo -->
  {#if ha}
    <div class="segment border border-gray-200 rounded-md overflow-hidden">
      <h4
        class="text-lg font-semibold p-3 bg-gray-100 border-b border-gray-200 text-gray-700 flex justify-between items-center"
      >
        <span>Header de Arquivo (Registro 0)</span>
        <span class="text-xs font-normal text-gray-500"
          >Linha {ha._lineNumber || "N/A"}</span
        >
      </h4>
      <!-- Render fields using #each -->
      <dl class="p-3 grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
        {#each prepareFieldsForRender(ha) as field (field.key)}
          <dt class="font-medium text-gray-500 truncate" title={field.key}>
            {field.label}:
          </dt>

          <dd
            class="text-gray-800 break-words"
            title={field.original ? `Original: ${field.original}` : ""}
          >
            {field.value}
          </dd>
        {/each}
      </dl>
      {#if ha._linha_original}
        <details class="text-xs p-2 bg-gray-50 border-t border-gray-200 mb-1">
          <summary class="cursor-pointer text-gray-500"
            >Ver linha original</summary
          >
          <pre
            class="mt-1 font-mono bg-white p-1 border rounded overflow-x-auto"><code
              >{ha._linha_original}</code
            ></pre>
        </details>
      {/if}
    </div>
  {/if}

  <!-- Lotes Loop -->
  {#each Object.entries(lotes) as [loteNum, loteData] (loteNum)}
    <div class="segment border border-gray-200 rounded-md overflow-hidden">
      <h4
        class="text-lg font-semibold p-3 bg-gray-100 border-b border-gray-200 text-gray-700"
      >
        Lote {loteNum}
        {#if loteData.header_lote?.tipo_servico}
          ({getLabel("tipo_servico")}: {formatValue(
            loteData.header_lote.tipo_servico,
          )}, {getLabel("tipo_operacao")}: {formatValue(
            loteData.header_lote.tipo_operacao,
          )})
        {/if}
        <span class="text-xs font-normal text-gray-500 ml-2"
          >Linhas {loteData._startLine || "?"} - {loteData._endLine ||
            "?"}</span
        >
      </h4>
      <div class="p-3 space-y-4">
        <!-- Header Lote -->
        {#if loteData.header_lote}
          <div class="sub-segment border-l-4 border-blue-200 pl-4 py-2">
            <h5
              class="font-semibold mb-1 text-blue-800 flex justify-between items-center"
            >
              <span>Header de Lote (Registro 1)</span>
              <span class="text-xs font-normal text-gray-500"
                >Linha {loteData.header_lote._lineNumber || "N/A"}</span
              >
            </h5>
            <dl class="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
              {#each prepareFieldsForRender(loteData.header_lote) as field (field.key)}
                <dt
                  class="font-medium text-gray-500 truncate"
                  title={field.key}
                >
                  {field.label}:
                </dt>
                <dd
                  class="text-gray-800 break-words"
                  title={field.original ? `Original: ${field.original}` : ""}
                >
                  {field.value}
                </dd>
              {/each}
            </dl>
            {#if loteData.header_lote._linha_original}
              <details class="text-xs mt-1">
                <summary class="cursor-pointer text-gray-500 mb-1"
                  >Ver linha original</summary
                >
                <pre
                  class="mt-1 font-mono bg-white p-1 border rounded overflow-x-auto"><code
                    >{loteData.header_lote._linha_original}</code
                  ></pre>
              </details>
            {/if}
          </div>
        {/if}

        <!-- Detalhes Agrupados -->
        {#if loteData.detalhes_agrupados && loteData.detalhes_agrupados.length > 0}
          <div class="sub-segment border-l-4 border-green-200 pl-4 py-2">
            <h5 class="font-semibold mb-2 text-green-800">
              Detalhes Agrupados (Registro 3) - {loteData.detalhes_agrupados
                .length} grupo(s)
            </h5>
            <div class="space-y-3">
              {#each loteData.detalhes_agrupados as group, groupIndex (groupIndex)}
                <div
                  class="border border-gray-200 rounded p-2 bg-white shadow-sm"
                >
                  <p class="text-xs font-medium text-gray-600 mb-1">
                    Grupo {groupIndex + 1}
                  </p>
                  {#if group._incomplete_group}
                    <p class="text-xs text-orange-600 italic mb-1">
                      Aviso: Grupo pode estar incompleto ou fora de sequência.
                    </p>
                  {/if}

                  {#each Object.entries(group) as [segmentKey, segmentData] (segmentKey)}
                    {#if !segmentKey.startsWith("_")}
                      <div class="segment-item mb-2 last:mb-0">
                        <h6
                          class="font-medium text-sm text-gray-700 flex justify-between items-center border-b border-dotted border-gray-300 pb-1 mb-1"
                        >
                          <span>Segmento {getSegmentType(segmentKey)}</span>
                          <span class="text-xs font-normal text-gray-500"
                            >Linha {segmentData._lineNumber || "N/A"}</span
                          >
                        </h6>
                        <!-- Render segment fields -->
                        <dl
                          class="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-xs"
                        >
                          {#each prepareFieldsForRender(segmentData) as field (field.key)}
                            <dt
                              class="font-medium text-gray-500 truncate"
                              title={field.key}
                            >
                              {field.label}:
                            </dt>
                            <dd
                              class="text-gray-800 break-words"
                              title={field.original
                                ? `Original: ${field.original}`
                                : ""}
                            >
                              {field.value}
                            </dd>
                          {/each}
                        </dl>
                        {#if segmentData._linha_original}
                          <details class="text-xs mt-1">
                            <summary class="cursor-pointer text-gray-500 mb-1"
                              >Ver linha original</summary
                            >
                            <pre
                              class="mt-1 font-mono bg-white p-1 border rounded overflow-x-auto"><code
                                >{segmentData._linha_original}</code
                              ></pre>
                          </details>
                        {/if}
                      </div>
                    {/if}
                  {/each}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Trailer Lote -->
        {#if loteData.trailer_lote}
          <div class="sub-segment border-l-4 border-blue-200 pl-4 py-2">
            <h5
              class="font-semibold mb-1 text-blue-800 flex justify-between items-center"
            >
              <span>Trailer de Lote (Registro 5)</span>
              <span class="text-xs font-normal text-gray-500"
                >Linha {loteData.trailer_lote._lineNumber || "N/A"}</span
              >
            </h5>
            <dl class="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
              {#each prepareFieldsForRender(loteData.trailer_lote) as field (field.key)}
                <dt
                  class="font-medium text-gray-500 truncate"
                  title={field.key}
                >
                  {field.label}:
                </dt>
                <dd
                  class="text-gray-800 break-words"
                  title={field.original ? `Original: ${field.original}` : ""}
                >
                  {field.value}
                </dd>
              {/each}
            </dl>
            {#if loteData.trailer_lote._linha_original}
              <details class="text-xs mt-1">
                <summary class="cursor-pointer text-gray-500 mb-1"
                  >Ver linha original</summary
                >
                <pre
                  class="mt-1 font-mono bg-white p-1 border rounded overflow-x-auto"><code
                    >{loteData.trailer_lote._linha_original}</code
                  ></pre>
              </details>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/each}

  <!-- Trailer Arquivo -->
  {#if ta}
    <div class="segment border border-gray-200 rounded-md overflow-hidden">
      <h4
        class="text-lg font-semibold p-3 bg-gray-100 border-b border-gray-200 text-gray-700 flex justify-between items-center"
      >
        <span>Trailer de Arquivo (Registro 9)</span>
        <span class="text-xs font-normal text-gray-500"
          >Linha {ta._lineNumber || "N/A"}</span
        >
      </h4>
      <dl class="p-3 grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
        {#each prepareFieldsForRender(ta) as field (field.key)}
          <dt class="font-medium text-gray-500 truncate" title={field.key}>
            {field.label}:
          </dt>
          <dd
            class="text-gray-800 break-words"
            title={field.original ? `Original: ${field.original}` : ""}
          >
            {field.value}
          </dd>
        {/each}
      </dl>
      {#if ta._linha_original}
        <details class="text-xs p-2 bg-gray-50 border-t border-gray-200 mb-1">
          <summary class="cursor-pointer text-gray-500"
            >Ver linha original</summary
          >
          <pre
            class="mt-1 font-mono bg-white p-1 border rounded overflow-x-auto"><code
              >{ta._linha_original}</code
            ></pre>
        </details>
      {/if}
    </div>
  {/if}

  {#if !result}
    <p class="text-center text-gray-500 italic mt-6">
      Nenhum arquivo processado ainda.
    </p>
  {/if}
</div>
