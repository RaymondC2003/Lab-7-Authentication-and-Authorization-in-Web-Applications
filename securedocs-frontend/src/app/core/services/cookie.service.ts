import { Injectable } from "@angular/core";

export interface LastVisitedDoc {
  docId: string;
  docTitle: string;
  visitedAt: string;
}

@Injectable({ providedIn: "root" })
export class CookieService {
  private cookieName(userId: string): string {
    return `lastVisitedDoc_${userId}`;
  }

  setLastVisitedDoc(userId: string, doc: LastVisitedDoc): void {
    const name = this.cookieName(userId);
    const value = encodeURIComponent(JSON.stringify(doc));
    const expires = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  }

  getLastVisitedDoc(userId: string): LastVisitedDoc | null {
    const name = this.cookieName(userId);
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [key, ...valueParts] = cookie.split("=");
      if (key.trim() === name) {
        try {
          return JSON.parse(decodeURIComponent(valueParts.join("=")));
        } catch {
          return null;
        }
      }
    }
    return null;
  }
}
