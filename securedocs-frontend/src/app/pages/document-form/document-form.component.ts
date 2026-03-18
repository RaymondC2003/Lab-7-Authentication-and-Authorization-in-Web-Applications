import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DocumentService } from "../../core/services/document.service";
import { CookieService } from "../../core/services/cookie.service";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-document-form",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./document-form.component.html",
})
export class DocumentFormComponent implements OnInit {
  form = {
    title: "",
    description: "",
  };

  documentId: string | null = null;
  isEditMode = false;
  error = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private cookieService: CookieService,
    private authService: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.documentId = this.route.snapshot.paramMap.get("id");
    this.isEditMode = !!this.documentId;

    if (this.isEditMode && this.documentId) {
      try {
        const document: any = await this.documentService.getById(
          this.documentId,
        );
        this.form.title = document.title;
        this.form.description = document.description;

        // Record this document as last visited (cookie updated on open)
        this.setLastVisitedCookie(this.documentId, document.title);
      } catch (err: any) {
        this.error = err?.error?.message || "Failed to load document";
      }
    }
  }

  private setLastVisitedCookie(docId: string, docTitle: string): void {
    const user = this.authService.user();
    const userId = user?.userId ?? user?.id ?? user?._id;
    if (userId) {
      this.cookieService.setLastVisitedDoc(String(userId), {
        docId,
        docTitle,
        visitedAt: new Date().toISOString(),
      });
    }
  }

  async submit(): Promise<void> {
    this.error = "";

    try {
      if (this.isEditMode && this.documentId) {
        await this.documentService.update(this.documentId, this.form);
        // Update cookie with latest title after a successful save
        this.setLastVisitedCookie(this.documentId, this.form.title);
      } else {
        await this.documentService.create(this.form);
      }

      this.router.navigate(["/documents"]);
    } catch (err: any) {
      this.error = err?.error?.message || "Save failed";
    }
  }
}
