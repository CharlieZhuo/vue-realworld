import { Ref, ref } from "vue";

interface useAsyncOutput<T> {
  startProcess: () => Promise<T>;
  isProcessing: Ref<boolean>;
}

export function useAsync<RT, AT>(prop: (...args: AT[]) => RT): useAsyncOutput<RT> {
  const isProcessingState = ref(false);

  async function startProcess(...args: AT[]): Promise<RT> {
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
