/**
 * PostsEmptyState 컴포넌트 테스트
 * 게시글 빈 상태 표시 컴포넌트
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { PostsEmptyState } from '../PostsEmptyState';

describe('PostsEmptyState', () => {
  describe('렌더링', () => {
    it('기본 빈 상태 메시지를 렌더링한다', () => {
      render(<PostsEmptyState isAuthenticated={false} />);

      expect(screen.getByText('아직 작성된 게시글이 없습니다.')).toBeInTheDocument();
    });

    it('중앙 정렬된 레이아웃을 렌더링한다', () => {
      const { container } = render(<PostsEmptyState isAuthenticated={false} />);

      const wrapper = container.querySelector('.flex.items-center.justify-center');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('로그인 상태에 따른 동작', () => {
    it('비로그인 상태에서는 작성 버튼을 표시하지 않는다', () => {
      render(<PostsEmptyState isAuthenticated={false} />);

      const button = screen.queryByRole('button', { name: /첫 게시글 작성하기/i });
      expect(button).not.toBeInTheDocument();
    });

    it('로그인 상태에서는 첫 게시글 작성 버튼을 표시한다', () => {
      render(<PostsEmptyState isAuthenticated={true} />);

      const link = screen.getByRole('link', { name: /첫 게시글 작성하기/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/posts/new');
    });

    it('작성 버튼이 올바른 링크를 가진다', () => {
      render(<PostsEmptyState isAuthenticated={true} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/posts/new');
    });
  });

  describe('접근성', () => {
    it('의미있는 텍스트를 제공한다', () => {
      render(<PostsEmptyState isAuthenticated={true} />);

      const message = screen.getByText('아직 작성된 게시글이 없습니다.');
      expect(message).toBeInTheDocument();
    });

    it('로그인 사용자에게 명확한 액션을 제공한다', () => {
      render(<PostsEmptyState isAuthenticated={true} />);

      const actionButton = screen.getByRole('button', { name: /첫 게시글 작성하기/i });
      expect(actionButton).toBeInTheDocument();
    });
  });
});
