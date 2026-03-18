import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly apiUrl = 'http://localhost:3000/api/documents';

  constructor(private http: HttpClient) {}

  async getAll(): Promise<any[]> {
    return await firstValueFrom(
      this.http.get<any[]>(this.apiUrl, { withCredentials: true })
    );
  }

  async getById(id: string): Promise<any> {
    return await firstValueFrom(
      this.http.get(`${this.apiUrl}/${id}`, { withCredentials: true })
    );
  }

  async create(data: { title: string; description: string }): Promise<any> {
    return await firstValueFrom(
      this.http.post(this.apiUrl, data, { withCredentials: true })
    );
  }

  async update(id: string, data: { title: string; description: string }): Promise<any> {
    return await firstValueFrom(
      this.http.put(`${this.apiUrl}/${id}`, data, { withCredentials: true })
    );
  }

  async delete(id: string): Promise<any> {
    return await firstValueFrom(
      this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true })
    );
  }
}