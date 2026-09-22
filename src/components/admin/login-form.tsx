'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { loginAction, type FormState } from '@/app/admin/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Đang kiểm tra...' : 'Đăng nhập'}
    </button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="mt-8">
      <input type="hidden" name="next" value={next} />

      {/*
        Form chỉ có một mật khẩu chung nên không cần người dùng nhập tên đăng nhập,
        nhưng trình duyệt và trình quản lý mật khẩu vẫn cần một trường username
        trong DOM để lưu và điền đúng. Trường này được ẩn hoàn toàn.
      */}
      <input
        type="text"
        name="username"
        value="admin"
        autoComplete="username"
        readOnly
        hidden
        tabIndex={-1}
        aria-hidden="true"
      />

      <label
        htmlFor="password"
        className="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase"
      >
        Mật khẩu
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        className="field mt-3"
      />

      {state.error ? (
        <p role="alert" className="mt-4 border-l-2 border-accent pl-3 text-sm text-ink">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
