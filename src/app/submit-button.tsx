"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = React.HTMLAttributes<HTMLButtonElement>;

export function SubmitButton(props: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="rounded-md border p-2"
      {...props}
    >
      {pending ? "Loading..." : props.children}
    </button>
  );
}
