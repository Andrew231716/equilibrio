/**
 * Stub opzionale per un futuro sync Supabase.
 * L'app funziona interamente in locale senza questo modulo.
 */
export type FutureAuthUser = {
  id: string;
  email?: string;
};

export interface FutureCloudSync {
  isEnabled: boolean;
  getUser: () => Promise<FutureAuthUser | null>;
  pushLocalSnapshot: (snapshot: unknown) => Promise<{ ok: boolean }>;
  pullRemoteSnapshot: () => Promise<unknown | null>;
}

export const supabaseSyncStub: FutureCloudSync = {
  isEnabled: false,
  async getUser() {
    return null;
  },
  async pushLocalSnapshot() {
    return { ok: false };
  },
  async pullRemoteSnapshot() {
    return null;
  },
};
