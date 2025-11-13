/**
 * Input 컴포넌트 단위 테스트
 * Shadcn/ui Input Atom 테스트
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from '../Input';

describe('Input', () => {
  describe('렌더링', () => {
    it('기본 입력 필드를 렌더링한다', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('placeholder를 렌더링한다', () => {
      render(<Input placeholder="Enter text" />);

      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
    });

    it('disabled 상태를 렌더링한다', () => {
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('value를 렌더링한다', () => {
      render(<Input value="Test value" readOnly />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('Test value');
    });
  });

  describe('input types', () => {
    it('text type을 렌더링한다', () => {
      render(<Input type="text" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('email type을 렌더링한다', () => {
      render(<Input type="email" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('password type을 렌더링한다', () => {
      render(<Input type="password" />);

      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('number type을 렌더링한다', () => {
      render(<Input type="number" />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('이벤트 핸들링', () => {
    it('onChange 이벤트를 처리한다', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello');

      expect(handleChange).toHaveBeenCalled();
      expect((input as HTMLInputElement).value).toBe('Hello');
    });

    it('onFocus 이벤트를 처리한다', async () => {
      const handleFocus = vi.fn();
      const user = userEvent.setup();

      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('onBlur 이벤트를 처리한다', async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();

      render(
        <>
          <Input onBlur={handleBlur} />
          <button>Other element</button>
        </>
      );

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');

      await user.click(input);
      await user.click(button);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('disabled 상태에서는 입력할 수 없다', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Input onChange={handleChange} disabled />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Test');

      expect(handleChange).not.toHaveBeenCalled();
      expect((input as HTMLInputElement).value).toBe('');
    });
  });

  describe('커스텀 스타일', () => {
    it('className prop을 적용한다', () => {
      render(<Input className="custom-class" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('접근성', () => {
    it('aria-label을 설정할 수 있다', () => {
      render(<Input aria-label="Email input" />);

      const input = screen.getByLabelText('Email input');
      expect(input).toBeInTheDocument();
    });

    it('aria-describedby를 설정할 수 있다', () => {
      render(
        <>
          <Input aria-describedby="email-description" />
          <span id="email-description">Enter your email address</span>
        </>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-description');
    });

    it('required 속성을 설정할 수 있다', () => {
      render(<Input required />);

      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });
  });

  describe('폼 통합', () => {
    it('name 속성을 설정할 수 있다', () => {
      render(<Input name="email" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'email');
    });

    it('defaultValue를 설정할 수 있다', () => {
      render(<Input defaultValue="Default text" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('Default text');
    });
  });
});
