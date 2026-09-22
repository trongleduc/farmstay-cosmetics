'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

type ConfirmSubmitProps = {
  message: string;
  children: ReactNode;
  className?: string;
};

/** Nút gửi form có bước xác nhận, dùng cho các thao tác không thể hoàn tác. */
export function ConfirmSubmit({ message, children, className }: ConfirmSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className={className}
    >
      {pending ? 'Đang xử lý...' : children}
    </button>
  );
}
