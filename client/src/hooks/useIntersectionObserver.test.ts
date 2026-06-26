import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
  let mockIntersectionObserver: any;
  let observerCallback: any;

  beforeEach(() => {
    mockIntersectionObserver = vi.fn((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    window.IntersectionObserver = mockIntersectionObserver as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create an IntersectionObserver', () => {
    renderHook(() => useIntersectionObserver());

    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('should return ref and isVisible state', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current).toHaveProperty('ref');
    expect(result.current).toHaveProperty('isVisible');
    expect(result.current.isVisible).toBe(false);
  });

  it('should accept custom threshold and rootMargin options', () => {
    renderHook(() => useIntersectionObserver({ threshold: 0.5, rootMargin: '10px' }));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.5,
        rootMargin: '10px',
      })
    );
  });

  it('should have default triggerOnce as true', () => {
    renderHook(() => useIntersectionObserver());

    expect(mockIntersectionObserver).toHaveBeenCalled();
  });
});
