import { useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, CircleAlert, Info, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { municipalNotifications } from "@/lib/municipal-data";

export function NotificationPanel() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const touchStart = useRef<{ id: string; x: number } | null>(null);
  const notifications = municipalNotifications.filter(
    (notification) => !dismissed.includes(notification.id),
  );
  const groups = useMemo(
    () =>
      Array.from(new Set(notifications.map((notification) => notification.date))).map((date) => ({
        date,
        items: notifications.filter((notification) => notification.date === date),
      })),
    [notifications],
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="relative grid size-9 place-items-center rounded-lg border border-border bg-card transition hover:bg-muted"
          aria-label="Open notifications"
        >
          <Bell className="size-4" />
          {notifications.length > 0 && (
            <span className="absolute right-1 top-1 size-1.5 rounded-full bg-destructive ring-2 ring-card" />
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5 pr-12">
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            {notifications.length
              ? `${notifications.length} updates need your attention.`
              : "You're all caught up."}
          </SheetDescription>
        </SheetHeader>
        {notifications.length > 0 && (
          <button
            onClick={() =>
              setDismissed(municipalNotifications.map((notification) => notification.id))
            }
            className="mx-6 mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            <CheckCheck className="size-4" /> Mark all read
          </button>
        )}
        <div className="space-y-6 p-6">
          {groups.map((group) => (
            <section key={group.date}>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {group.date}
              </h3>
              <div className="space-y-2">
                {group.items.map((notification) => (
                  <article
                    key={notification.id}
                    className="group flex gap-3 rounded-xl border border-border p-3 transition hover:bg-muted/60"
                    onPointerDown={(event) => {
                      touchStart.current =
                        event.pointerType === "touch"
                          ? { id: notification.id, x: event.clientX }
                          : null;
                    }}
                    onPointerUp={(event) => {
                      if (
                        touchStart.current?.id === notification.id &&
                        touchStart.current.x - event.clientX >= 72
                      ) {
                        setDismissed((items) => [...items, notification.id]);
                      }
                      touchStart.current = null;
                    }}
                    onPointerCancel={() => {
                      touchStart.current = null;
                    }}
                  >
                    <div
                      className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${notification.tone === "critical" ? "bg-destructive/10 text-destructive" : notification.tone === "success" ? "bg-primary/15 text-primary" : "bg-info/10 text-info"}`}
                    >
                      {notification.tone === "critical" ? (
                        <CircleAlert className="size-4" />
                      ) : (
                        <Info className="size-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{notification.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {notification.detail}
                      </p>
                    </div>
                    <button
                      onClick={() => setDismissed((items) => [...items, notification.id])}
                      className="size-6 shrink-0 rounded-md text-muted-foreground opacity-100 transition hover:bg-card hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label={`Dismiss ${notification.title}`}
                    >
                      <X className="mx-auto size-3.5" />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}
          {!notifications.length && (
            <div className="rounded-xl border border-dashed border-border px-5 py-12 text-center text-sm text-muted-foreground">
              No new notifications. Your operation is running smoothly.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
