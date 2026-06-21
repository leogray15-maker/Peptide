// ─── Shared Firestore helpers ─────────────────────────────────────────────

// Never let a Firestore call hang the UI indefinitely. If the network or rules
// leave a request pending, reject after `ms` so callers can fall back / show an
// error instead of an endless spinner. We also log the request's *eventual* real
// outcome (even after the timeout fires) so the true Firestore error code is
// visible in the console for diagnosis.
export function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  promise.then(
    () => console.info(`[Firestore] ${label} actually succeeded`),
    (e: { code?: string; message?: string }) =>
      console.warn(`[Firestore] ${label} truly failed →`, e?.code ?? "(no code)", e?.message ?? e)
  );
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => {
        const err = new Error(`${label} timed out`) as Error & { code?: string };
        err.code = "deadline-exceeded";
        reject(err);
      }, ms)
    ),
  ]);
}
