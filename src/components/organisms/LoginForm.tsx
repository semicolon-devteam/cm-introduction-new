"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

import { Button } from "@atoms/Button";
import { FormField } from "@molecules/FormField";
import { ActionButton } from "@molecules/ActionButton";
import { /* useAuth, */ validateEmail, validatePassword } from "@hooks/auth";
import { loginAction, loginWithOAuthAction } from "@app/actions/auth.actions";

interface LoginFormProps {
  error?: string;
}

export function LoginForm({ error: initialError }: LoginFormProps) {
  const router = useRouter();
  // const { user } = useAuth(); // Will be used for auth state check later

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  // Form state management
  const [values, setValues] = useState({ email: "", password: "" });
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

    if (!values.password) {
      errors.password = "비밀번호를 입력해주세요.";
    } else if (!validatePassword(values.password)) {
      errors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const result = await loginAction(values.email, values.password);

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setLoading(true);
    const result = await loginWithOAuthAction(provider);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.url) {
      router.push(result.url);
    }
  };

  const clearError = () => {
    setError(undefined);
  };

  const displayError = error || initialError;

  return (
    <>
      {displayError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 mb-4">
          {displayError}
          <button onClick={clearError} className="ml-2 text-red-800 hover:text-red-900">
            ✕
          </button>
        </div>
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
            id="password"
            name="password"
            label="비밀번호"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={formErrors.password}
            required
            disabled={loading}
          />

          <div className="text-sm">
            <Link href="/auth/reset-password" className="text-blue-600 hover:underline">
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          <ActionButton
            type="submit"
            fullWidth
            loading={loading}
            loadingText="로그인 중..."
            icon={LogIn}
          >
            로그인
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
          onClick={() => void handleOAuthLogin("google")}
          disabled={loading}
        >
          Google로 로그인
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => void handleOAuthLogin("github")}
          disabled={loading}
        >
          GitHub로 로그인
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        계정이 없으신가요?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          회원가입
        </Link>
      </div>
    </>
  );
}
