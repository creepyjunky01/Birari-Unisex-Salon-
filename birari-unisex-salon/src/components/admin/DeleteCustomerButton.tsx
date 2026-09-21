"use client";

import { useTransition } from "react";

export default function DeleteCustomerButton({
  customerId,
  action,
  label = "Delete"
}: {
  customerId: string;
  action: (customerId: string) => Promise<void>;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const confirmed = window.confirm(
      "Delete this registration permanently? This removes the customer, payment, and offer records and cannot be undone."
    );
    if (!confirmed) return;

    startTransition(() => {
      action(customerId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : label}
    </button>
  );
}
