/**
 * PostsHeader 컴포넌트 테스트
 * 게시글 목록 헤더 컴포넌트
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { PostsHeader } from '../PostsHeader';

describe('PostsHeader', () => {
  describe('렌더링', () => {
    it('페이지 제목을 렌더링한다', () => {
      render(<PostsHeader isAuthenticated={false} />);

      expect(screen.getByRole('heading', { name: '커뮤니티 피드' })).toBeInTheDocument();
    });

    it('페이지 설명을 렌더링한다', () => {
      render(<PostsHeader isAuthenticated={false} />);

      expect(screen.getByText('최신 게시물과 인기 토론을 확인하세요')).toBeInTheDocument();
    });

    it('헤더와 액션 버튼을 포함하는 레이아웃을 렌더링한다', () => {
      const { container } = render(<PostsHeader isAuthenticated={false} />);

      const headerLayout = container.querySelector('.flex.items-center.justify-between');
      expect(headerLayout).toBeInTheDocument();
    });
  });

  describe('로그인 상태에 따른 버튼', () => {
    it('비로그인 상태에서는 로그인 유도 버튼을 표시한다', () => {
      render(<PostsHeader isAuthenticated={false} />);

      const loginButton = screen.getByRole('button', { name: /로그인하여 글 작성/i });
      expect(loginButton).toBeInTheDocument();

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/auth/login');
    });

    it('로그인 상태에서는 새 글 작성 버튼을 표시한다', () => {
      render(<PostsHeader isAuthenticated={true} />);

      const createButton = screen.getByRole('button', { name: /새 글 작성/i });
      expect(createButton).toBeInTheDocument();

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/posts/new');
    });

    it('새 글 작성 버튼에 아이콘이 포함된다', () => {
      render(<PostsHeader isAuthenticated={true} />);

      const button = screen.getByRole('button', { name: /새 글 작성/i });
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('링크 동작', () => {
    it('로그인 버튼이 올바른 경로로 연결된다', () => {
      render(<PostsHeader isAuthenticated={false} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/auth/login');
    });

    it('새 글 작성 버튼이 올바른 경로로 연결된다', () => {
      render(<PostsHeader isAuthenticated={true} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/posts/new');
    });
  });

  describe('접근성', () => {
    it('제목이 h1 태그로 마크업된다', () => {
      render(<PostsHeader isAuthenticated={false} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('커뮤니티 피드');
    });

    it('명확한 액션 버튼 텍스트를 제공한다', () => {
      render(<PostsHeader isAuthenticated={true} />);

      const button = screen.getByRole('button', { name: /새 글 작성/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('상태 변경', () => {
    it('isAuthenticated가 변경되면 버튼이 변경된다', () => {
      const { rerender } = render(<PostsHeader isAuthenticated={false} />);

      expect(screen.getByText(/로그인하여 글 작성/i)).toBeInTheDocument();

      rerender(<PostsHeader isAuthenticated={true} />);

      expect(screen.getByText(/새 글 작성/i)).toBeInTheDocument();
      expect(screen.queryByText(/로그인하여 글 작성/i)).not.toBeInTheDocument();
    });
  });
});
