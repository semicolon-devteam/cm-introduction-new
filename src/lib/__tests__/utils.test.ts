/**
 * 유틸리티 함수 테스트
 * lib/utils.ts - cn() 함수 테스트
 */

import { describe, it, expect } from 'vitest';

import { cn } from '../utils';

describe('cn (className utility)', () => {
  describe('기본 동작', () => {
    it('단일 클래스명을 반환한다', () => {
      const result = cn('text-red-500');
      expect(result).toBe('text-red-500');
    });

    it('여러 클래스명을 결합한다', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });

    it('빈 문자열을 무시한다', () => {
      const result = cn('text-red-500', '', 'bg-blue-500');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
      expect(result).not.toContain('  '); // 연속 공백 없음
    });

    it('undefined를 무시한다', () => {
      const result = cn('text-red-500', undefined, 'bg-blue-500');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });

    it('null을 무시한다', () => {
      const result = cn('text-red-500', null, 'bg-blue-500');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });

    it('false를 무시한다', () => {
      const result = cn('text-red-500', false, 'bg-blue-500');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });
  });

  describe('조건부 클래스명', () => {
    it('조건부 클래스명을 처리한다', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });

    it('false 조건일 때 클래스를 추가하지 않는다', () => {
      const isActive = false;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).not.toContain('active-class');
    });

    it('삼항 연산자 조건을 처리한다', () => {
      const variant = 'primary';
      const result = cn(
        'button',
        variant === 'primary' ? 'button-primary' : 'button-secondary'
      );
      expect(result).toContain('button');
      expect(result).toContain('button-primary');
      expect(result).not.toContain('button-secondary');
    });
  });

  describe('Tailwind 충돌 해결', () => {
    it('중복된 클래스를 병합한다', () => {
      const result = cn('px-4 py-2', 'px-6');
      // twMerge에 의해 px-6이 px-4를 덮어씀
      expect(result).toContain('px-6');
      expect(result).not.toContain('px-4');
      expect(result).toContain('py-2');
    });

    it('충돌하는 배경색을 병합한다', () => {
      const result = cn('bg-red-500', 'bg-blue-500');
      // 마지막 클래스가 우선
      expect(result).toContain('bg-blue-500');
      expect(result).not.toContain('bg-red-500');
    });

    it('충돌하지 않는 클래스는 모두 유지한다', () => {
      const result = cn('text-white', 'bg-black', 'rounded-md', 'shadow-lg');
      expect(result).toContain('text-white');
      expect(result).toContain('bg-black');
      expect(result).toContain('rounded-md');
      expect(result).toContain('shadow-lg');
    });
  });

  describe('배열 입력', () => {
    it('배열 형태의 클래스명을 처리한다', () => {
      const result = cn(['text-red-500', 'bg-blue-500']);
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });

    it('중첩 배열을 처리한다', () => {
      const result = cn(['text-red-500', ['bg-blue-500', 'rounded-md']]);
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('rounded-md');
    });
  });

  describe('객체 입력', () => {
    it('객체 형태의 조건부 클래스를 처리한다', () => {
      const result = cn({
        'text-red-500': true,
        'bg-blue-500': true,
        'hidden': false,
      });
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
      expect(result).not.toContain('hidden');
    });

    it('동적 조건을 가진 객체를 처리한다', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn({
        'active': isActive,
        'disabled': isDisabled,
      });
      expect(result).toContain('active');
      expect(result).not.toContain('disabled');
    });
  });

  describe('복합 입력', () => {
    it('문자열, 배열, 객체를 혼합하여 처리한다', () => {
      const result = cn(
        'base-class',
        ['array-class-1', 'array-class-2'],
        { 'object-class': true, 'hidden': false },
        'final-class'
      );
      expect(result).toContain('base-class');
      expect(result).toContain('array-class-1');
      expect(result).toContain('array-class-2');
      expect(result).toContain('object-class');
      expect(result).not.toContain('hidden');
      expect(result).toContain('final-class');
    });
  });

  describe('엣지 케이스', () => {
    it('인자가 없으면 빈 문자열을 반환한다', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('모든 값이 falsy면 빈 문자열을 반환한다', () => {
      const result = cn(false, null, undefined, '');
      expect(result).toBe('');
    });

    it('공백이 많은 클래스명을 정리한다', () => {
      const result = cn('  text-red-500  ', '  bg-blue-500  ');
      expect(result).not.toContain('  '); // 연속 공백 제거
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });
  });
});
