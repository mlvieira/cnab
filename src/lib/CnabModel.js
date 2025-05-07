// @ts-nocheck
import { writable } from "svelte/store";
import { Cnab240Processor } from "./Cnab240Processor";

const createCnabStore = () => {
  const { subscribe, set, update } = writable({
    fileName: null,
    status: "idle", // idle | loading | success | error
    error: null,
    parsedResult: null,
  });

  const processor = new Cnab240Processor();

  const processCnabFile = async (file) => {
    if (!file) return;

    update((state) => ({
      ...state,
      fileName: file.name,
      status: "loading",
      error: null,
      parsedResult: null,
    }));

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        if (!fileContent) {
          throw new Error("O arquivo não contém nenhum dado ou não pode ser lido.");
        }

        const result = processor.parse(fileContent);

        update((state) => ({
          ...state,
          status: result.errors?.length > 0 ? "error" : "success",
          parsedResult: result,
          error: result.errors?.length > 0 ? `Foi encontrado ${result.errors.length} erro(s) critícos durante o processamento. Verifique os detalhes.` : null,
        }));

      } catch (err) {
        console.error("Erro processando arquivo CNAB: ", err);
        update((state) => ({
          ...state,
          status: "error",
          error: `Processing error: ${err.message}`,
          parsedResult: null,
        }));
      }
    };

    reader.onerror = (e) => {
      console.error("Erro lendo o arquivo: ", reader.error);
      update((state) => ({
        ...state,
        status: "error",
        error: `Erro ao ler o arquivo: ${reader.error?.message || "Erro desconhecido de leitura"}`,
        parsedResult: null,
      }));
    };

    reader.readAsText(file, "ISO-8859-1");
  };

  const reset = () => {
    set({
      fileName: null,
      status: "idle",
      error: null,
      parsedResult: null,
    });
  };

  return {
    subscribe,
    processCnabFile,
    reset,
  };
};

export const cnabStore = createCnabStore();

