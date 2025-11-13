"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Check } from "lucide-react";

import { Button } from "@atoms/Button";
import { FormField } from "@molecules/FormField";
import { ActionButton } from "@molecules/ActionButton";
import {
  // useAuth,
  validateEmail,
  validatePassword,
  validateNickname,
} from "@hooks/auth";
import { signUpAction, loginWithOAuthAction } from "@app/actions/auth.actions";

interface RegisterFormProps {
  error?: string;
}

export function RegisterForm({ error: initialError }: RegisterFormProps) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  // Form state management
  const [values, setValues] = useState({
    email: "",
    login_id: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!values.email) {
      errors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(values.email)) {
      errors.email = "유효한 이메일 주소를 입력해주세요.";
    }

    if (!values.nickname) {
      errors.nickname = "닉네임을 입력해주세요.";
    } else if (!validateNickname(values.nickname)) {
      errors.nickname = "닉네임은 3-20자의 한글, 영문, 숫자만 가능합니다.";
    }

    if (!values.password) {
      errors.password = "비밀번호를 입력해주세요.";
    } else if (!validatePassword(values.password)) {
      errors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }

    if (!values.passwordConfirm) {
      errors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    } else if (values.password !== values.passwordConfirm) {
      errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const result = await signUpAction(values.email, values.password, {
        nickname: values.nickname,
        login_id: values.login_id,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setSuccess(true);
      }
    }
  };

  const handleOAuthRegister = async (provider: "google" | "github") => {
    setLoading(true);
    const result = await loginWithOAuthAction(provider);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.url) {
      router.push(result.url);
    }
  };

  const displayError = error || initialError;

  if (success) {
    return (
      <div className="rounded-lg border border-green-300 bg-green-50 p-4">
        <div className="flex items-center gap-2 text-green-800">
          <Check className="h-5 w-5" />
          <p className="font-semibold">회원가입이 완료되었습니다!</p>
        </div>
        <p className="mt-2 text-sm text-green-700">
          인증 메일을 확인해주세요. 인증 후 로그인이 가능합니다.
        </p>
        <Button onClick={() => router.push("/auth/login")} className="mt-4">
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }

  return (
    <>
      {displayError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 mb-4">{displayError}</div>
      )}

      <form onSubmit={(e) => void handleSubmit(e)}>
        <div className="space-y-4">
          <FormField
            id="email"
            name="email"
            label="이메일"
            type="email"
            placeholder="name@example.com"
            value={values.email}
            onChange={handleChange}
            error={formErrors.email}
            required
            disabled={loading}
          />

          <FormField
            id="nickname"
            name="nickname"
            label="닉네임"
            placeholder="닉네임을 입력하세요"
            value={values.nickname}
            onChange={handleChange}
            error={formErrors.nickname}
            required
            disabled={loading}
          />

          <FormField
            id="password"
            name="password"
            label="비밀번호"
            type="password"
            placeholder="최소 6자 이상"
            value={values.password}
            onChange={handleChange}
            error={formErrors.password}
            required
            disabled={loading}
          />

          <FormField
            id="passwordConfirm"
            name="passwordConfirm"
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={values.passwordConfirm}
            onChange={handleChange}
            error={formErrors.passwordConfirm}
            required
            disabled={loading}
          />

          <ActionButton
            type="submit"
            fullWidth
            loading={loading}
            loadingText="회원가입 중..."
            icon={UserPlus}
          >
            회원가입
          </ActionButton>
        </div>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">또는</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => void handleOAuthRegister("google")}
          disabled={loading}
        >
          Google로 회원가입
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => void handleOAuthRegister("github")}
          disabled={loading}
        >
          GitHub로 회원가입
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{" "}
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          로그인
        </Link>
      </div>
    </>
  );
}
