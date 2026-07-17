import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle } from "lucide-react";
import { useAdminLang } from "./adminI18n";

interface ConfirmState {
  message: string;
  resolve: (value: boolean) => void;
}

const ConfirmContext = createContext<((message: string) => Promise<boolean>) | null>(null);

// Promise-based replacement for window.confirm() — native browser confirm
// dialogs can't be styled and look jarring against the rest of the admin
// UI. Mounted once near the root; any admin page calls useConfirm() and
// awaits the result exactly like the native API.
export function AdminConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);
  const { t, dir } = useAdminLang();

  const confirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setState({ message, resolve });
    });
  }, []);

  function settle(result: boolean) {
    state?.resolve(result);
    setState(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div
          dir={dir}
          role="alertdialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => settle(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-ink/[0.08] bg-[var(--color-card)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/80">{state.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => settle(false)}
                className="rounded-full border border-ink/10 px-5 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-ink/20 hover:text-ink"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => settle(true)}
                className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                {t.common.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within AdminConfirmProvider");
  return ctx;
}
