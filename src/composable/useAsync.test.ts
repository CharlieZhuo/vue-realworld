import { describe, expect, it, vi } from "vitest";
import { useAsync } from "./useAsync";
import { flushPromises } from "@vue/test-utils";

let testPromiseResolve: (v: any) => void;
let testPromise = new Promise((resolve) => {
  testPromiseResolve = resolve;
});
const testObjectWithFunction = {
  testFunction: () => {
    return testPromise;
  },
};

describe("useAsync", () => {
  it("should be defined", () => {
    expect(useAsync).toBeDefined();
  });
  it("should return an object with isProcessing and startProcess", () => {
    const { isProcessing, startProcess } = useAsync(() => {});
    expect(isProcessing).toBeDefined();
    expect(startProcess).toBeDefined();
  });
  describe("returned isProcessing", () => {
    it(" should indicate whether supplied function has returned", async () => {
      const { isProcessing, startProcess } = useAsync(() => testPromise);
      expect(isProcessing.value).toBe(false);
      startProcess();
      expect(isProcessing.value).toBe(true);
      testPromiseResolve("example");
      expect(isProcessing.value).toBe(true);
      await flushPromises();
      expect(isProcessing.value).toBe(false);
    });
  });

  describe("returned startProcess", () => {
    const testObjectSpy = vi.spyOn(testObjectWithFunction, "testFunction");
    const { startProcess } = useAsync(testObjectWithFunction.testFunction);
    testObjectSpy.mockClear();
    const result = startProcess();
    it(" should starts the supplied function", async () => {
      expect(testObjectSpy).toHaveBeenCalled();
    });
    it(" should return a promise", () => {
      expect(result).toBeInstanceOf(Promise);
    });
    it(" should resolve the promise with the value returned by the supplied function", async () => {
      const resolveValue = "example";
      testPromiseResolve(resolveValue);
      expect(await result).toBe(resolveValue);
    });
  });
});
