<script>
  import { cnabStore } from "./lib/CnabModel.js";
  import CnabViewer from "./lib/CnabViewer.svelte";

  let fileInput;
  const state = cnabStore;
  const currentYear = new Date().getFullYear(); // Get current year for footer

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      cnabStore.processCnabFile(file);
    }
  }

  function handleReset() {
    cnabStore.reset();
    if (fileInput) {
      fileInput.value = "";
    }
  }

  function downloadJson() {
    const resultData = $state.parsedResult;
    const inputFileName = $state.fileName || "cnab_file";
    const baseName = inputFileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    const filename = `cnab_result_${baseName}.json`;

    if (!resultData) {
      alert("Nenhum dado processado para baixar.");
      return;
    }

    try {
      const jsonString = JSON.stringify(resultData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a); // Required for Firefox
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error("Erro ao gerar JSON para download:", error);
      alert("Ocorreu um erro ao gerar o arquivo JSON.");
    }
  }
</script>

<!-- Wrap main content and footer in a flex container for layout -->
<div class="flex flex-col min-h-screen">
  <main class="flex-grow max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-8 w-full">
    <h1 class="text-2xl font-bold mb-4 text-gray-700">
      Leitor CNAB 240 (REM/RET) <!-- Updated Title -->
    </h1>
    <p class="mb-2 text-gray-600">
      Selecione um arquivo CNAB 240 (remessa ou retorno) para análise local no
      navegador.
    </p>
    <p class="mb-6 text-sm text-orange-700 bg-orange-100 p-3 rounded border border-orange-300">
      <strong>Atenção:</strong> Este é um leitor básico e pode não interpretar
      todos os segmentos ou validações específicas do seu banco.
    </p>

    <div class="controls mb-6 flex flex-wrap items-center gap-4">
      <label for="cnabFile" class="font-semibold text-gray-700"
        >Arquivo CNAB:</label
      >
      <input
        type="file"
        id="cnabFile"
        accept=".rem,.txt,.REM,.TXT,.ret,.RET"
        on:change={handleFileSelect}
        bind:this={fileInput}
        disabled={$state.status === "loading"}
        class="block w-full sm:w-auto text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100
               disabled:opacity-50 disabled:cursor-not-allowed flex-grow"
      />
      <button
        on:click={handleReset}
        disabled={$state.status === "idle" && !$state.fileName}
        class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Limpar
      </button>
      <!-- Download Button -->
      <button
        on:click={downloadJson}
        disabled={!$state.parsedResult || $state.status === "loading"}
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Baixar resultado como JSON"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 inline-block mr-1 align-text-bottom"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Download JSON
      </button>
    </div>

    {#if $state.status === 'loading'}
      <p class="text-blue-600 animate-pulse">
        Carregando e processando arquivo...
      </p>
    {/if}

    {#if $state.status === 'error'}
      <p class="text-red-600 font-semibold bg-red-100 p-3 rounded border border-red-300">
        Erro: {$state.error}
      </p>
    {/if}

    {#if $state.parsedResult}
      <h2 class="text-xl font-semibold mb-4 text-gray-700">
        Resultado da Análise: <span class="font-normal italic"
          >{$state.fileName}</span
        >
      </h2>
      <CnabViewer result={$state.parsedResult} />
    {/if}
  </main>

  <!-- Footer Section -->
  <footer class="w-full text-center p-4 mt-auto bg-gray-200 text-gray-600 text-sm">
    <p>&copy; {currentYear} Matheus Vieira. Todos os direitos reservados.</p>
    <p><a href="https://github.com/mlvieira" class="hover:underline">Github</a></p>
  </footer>
</div>
