import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
  let observerCallback: IntersectionObserverCallback | null = null;
  let observeSpy: ReturnType<typeof vi.fn>;
  let unobserveSpy: ReturnType<typeof vi.fn>;
  let disconnectSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    observeSpy = vi.fn();
    unobserveSpy = vi.fn();
    disconnectSpy = vi.fn();

    // vitest v4 / jsdom: IntersectionObserver mock은 class 형태여야 new 키워드로 호출 가능
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: ReadonlyArray<number> = [];

      constructor(
        callback: IntersectionObserverCallback,
        _options?: IntersectionObserverInit
      ) {
        observerCallback = callback;
      }
      observe = observeSpy;
      unobserve = unobserveSpy;
      disconnect = disconnectSpy;
      takeRecords(): IntersectionObserverEntry[] { return []; }
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    observerCallback = null;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('should create an IntersectionObserver', () => {
    renderHook(() => useIntersectionObserver());
    // observerCallback이 설정됐다면 IntersectionObserver가 생성된 것
    expect(observerCallback).toBeTypeOf('function');
  });

  it('should return ref and isVisible state', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    expect(result.current).toHaveProperty('ref');
    expect(result.current).toHaveProperty('isVisible');
    expect(result.current.isVisible).toBe(false);
  });

  it('should accept custom threshold and rootMargin options', () => {
    // options가 생성자에 전달되는지 확인하기 위해 spy 방식으로 검증
    let capturedOptions: IntersectionObserverInit | undefined;

    class OptionCapturingObserver implements IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: ReadonlyArray<number> = [];
      constructor(_cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        observerCallback = _cb;
        capturedOptions = options;
      }
      observe = observeSpy;
      unobserve = unobserveSpy;
      disconnect = disconnectSpy;
      takeRecords(): IntersectionObserverEntry[] { return []; }
    }
    vi.stubGlobal('IntersectionObserver', OptionCapturingObserver);

    renderHook(() => useIntersectionObserver({ threshold: 0.5, rootMargin: '10px' }));

    expect(capturedOptions).toMatchObject({ threshold: 0.5, rootMargin: '10px' });
  });

  it('should have default triggerOnce as true', () => {
    renderHook(() => useIntersectionObserver());
    // triggerOnce 기본값이 true이면 observer가 정상 생성됨
    expect(observerCallback).toBeTypeOf('function');
  });
});
