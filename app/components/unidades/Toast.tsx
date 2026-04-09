"use client";

import { THEME } from "../../theme";

export default function Toast({ toast }: any) {
  if (!toast) return null;

  return (
    <div className={`fixed bottom-5 right-5 z-[100] ${toast.type === "ok" ? THEME.toastOk : THEME.toastErr}`}>
      {toast.msg}
    </div>
  );
}