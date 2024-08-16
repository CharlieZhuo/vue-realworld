import { ref } from "vue";

interface useAsyncInput<T> {
  process: (...args: unknown[]) => T;
}
interface useAsyncOutput<T> {
  startProcess: () => Promise<T>;
  isProcessing: boolean;
}

export function useAsync<T>(prop: useAsyncInput<T>): useAsyncOutput<T> {
  const isProcessingState = ref(false);

  async function startProcess(...args: unknown[]): Promise<T> {
    isProcessingState.value = true;
    try {
      const result = await prop.process(...args);
      return result;
    } finally {
      isProcessingState.value = false;
    }
  }

  return {
    startProcess,
    isProcessing: isProcessingState.value,
  };
}
