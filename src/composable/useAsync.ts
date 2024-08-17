import { Ref, ref } from "vue";

interface useAsyncOutput<T> {
  startProcess: () => Promise<T>;
  isProcessing: Ref<boolean>;
}

export function useAsync<T>(
  prop: (...args: unknown[]) => T
): useAsyncOutput<T> {
  const isProcessingState = ref(false);

  async function startProcess(...args: unknown[]): Promise<T> {
    isProcessingState.value = true;
    try {
      const result = await prop(...args);
      isProcessingState.value = false;
      return result;
    } finally {
      isProcessingState.value = false;
    }
  }

  return {
    startProcess,
    isProcessing: isProcessingState,
  };
}
