import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { DocumentService } from "../../core/services/document.service";
import {
  CookieService,
  LastVisitedDoc,
} from "../../core/services/cookie.service";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-documents",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./documents.component.html",
})
export class DocumentsComponent implements OnInit {
  documents: any[] = [];
  error = "";
  lastVisited: LastVisitedDoc | null = null;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadDocuments();
    this.loadLastVisited();
  }

  private loadLastVisited(): void {
    const user = this.authService.user();
    const userId = user?.userId ?? user?.id ?? user?._id;
    if (userId) {
      this.lastVisited = this.cookieService.getLastVisitedDoc(String(userId));
    }
  }

  formatVisitedAt(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async loadDocuments(): Promise<void> {
    try {
      this.documents = await this.documentService.getAll();
    } catch (err: any) {
      this.error = err?.error?.message || "Failed to load documents";
    }
  }

  editDocument(id: string): void {
    this.router.navigate(["/documents/edit", id]);
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      await this.documentService.delete(id);
      await this.loadDocuments();
    } catch (err: any) {
      this.error = err?.error?.message || "Failed to delete document";
    }
  }
}
