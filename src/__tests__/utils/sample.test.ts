import { describe, it, expect } from 'vitest';

/**
 * Vitest 설정 검증을 위한 샘플 테스트
 */
describe('Vitest Setup', () => {
  it('should run basic test', () => {
    expect(true).toBe(true);
  });

  it('should perform arithmetic operations', () => {
    expect(1 + 1).toBe(2);
    expect(10 - 5).toBe(5);
    expect(2 * 3).toBe(6);
    expect(10 / 2).toBe(5);
  });

  it('should handle arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it('should handle objects', () => {
    const obj = { name: 'test', value: 123 };
    expect(obj).toEqual({ name: 'test', value: 123 });
    expect(obj).toHaveProperty('name');
    expect(obj.name).toBe('test');
  });
});
