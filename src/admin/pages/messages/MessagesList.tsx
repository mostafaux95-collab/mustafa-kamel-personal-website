import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import clsx from "clsx";
import { api } from "@/admin/lib/api";
import { useHasPermission } from "@/admin/lib/auth";
import { useAdminLang } from "@/admin/lib/adminI18n";
import { useConfirm } from "@/admin/lib/confirm";

interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface ListResult {
  items: ContactMessageItem[];
  total: number;
  unread: number;
}

export default function MessagesList() {
  const { t } = useAdminLang();
  const canWrite = useHasPermission("messages:write");
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "messages", "list"],
    queryFn: () => api.get<ListResult>("/admin/messages?pageSize=100"),
  });

  const toggleReadMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      api.patch(`/admin/messages/${id}`, { isRead }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "messages"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/messages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "messages"] }),
  });

  const items = data?.items ?? [];

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{t.messages.title}</h1>
          <p className="mt-1 text-sm text-ink/50">
            {data?.total ?? 0} {t.common.total}
            {data && data.unread > 0 ? ` · ${data.unread} ${t.messages.unread.toLowerCase()}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="py-10 text-center text-sm text-ink/40">{t.common.loading}</p>}
        {!isLoading && items.length === 0 && (
          <p className="py-10 text-center text-sm text-ink/40">{t.messages.empty}</p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className={clsx(
              "rounded-2xl border p-5",
              item.isRead ? "border-ink/[0.08] bg-[var(--color-card)]" : "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.04]",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-semibold text-ink">{item.name}</span>
                  {!item.isRead && (
                    <span className="rounded-full bg-[var(--color-accent)]/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-accent)]">
                      {t.messages.unread}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-ink/45">
                  {item.email}
                  {item.whatsapp ? ` · ${item.whatsapp}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink/40">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                {canWrite && (
                  <>
                    <button
                      onClick={() =>
                        toggleReadMutation.mutate({ id: item.id, isRead: !item.isRead })
                      }
                      className="text-ink/35 transition-colors hover:text-ink"
                      aria-label={item.isRead ? t.messages.markUnread : t.messages.markRead}
                      title={item.isRead ? t.messages.markUnread : t.messages.markRead}
                    >
                      {item.isRead ? <Mail size={15} /> : <MailOpen size={15} />}
                    </button>
                    <button
                      onClick={async () => {
                        if (await confirm(t.messages.deleteConfirm)) deleteMutation.mutate(item.id);
                      }}
                      className="text-ink/35 transition-colors hover:text-red-400"
                      aria-label={t.common.delete}
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/70">
              {item.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
