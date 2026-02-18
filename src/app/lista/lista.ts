import { Component, signal, inject, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './lista.html',
  styleUrl: './lista.scss',
})
export class Lista {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  novoItem: string = '';
  itens = signal<{ nome: string; comprado: boolean }[]>([]);
  carregando = signal(false);
  erro = signal<string | null>(null);

  constructor() {
    this.carregarItens();
  }

  private carregarItens() {
    this.carregando.set(true);
    this.erro.set(null);
    
    this.http
      .get<{ nome: string; comprado: boolean }[]>('/api/lista')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.itens.set(data ?? []);
          this.carregando.set(false);
        },
        error: (err) => {
          console.error('Erro ao carregar itens:', err);
          this.erro.set('Erro ao carregar itens. Tente novamente.');
          this.carregando.set(false);
        },
      });
  }

  private salvar() {
    this.http
      .put('/api/lista', this.itens())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          console.error('Erro ao salvar itens:', err);
          this.erro.set('Erro ao salvar. Tente novamente.');
        },
      });
  }

  adicionar() {
    const itemTrimmed = this.novoItem.trim();
    if (itemTrimmed === '' || itemTrimmed.length > 100) return;
    
    this.itens.update(lista => [...lista, { nome: itemTrimmed, comprado: false }]);
    this.novoItem = '';
    this.erro.set(null);
    this.salvar();
  }

  remover(index: number) {
    this.itens.update(lista => lista.filter((_, i) => i !== index));
    this.erro.set(null);
    this.salvar();
  }

  alternarComprado(index: number) {
    this.itens.update(lista =>
      lista.map((item, i) => i === index ? { ...item, comprado: !item.comprado } : item)
    );
    this.erro.set(null);
    this.salvar();
  }

  get comprados() {
    return this.itens()
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.comprado);
  }

  get aComprar() {
    return this.itens()
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.comprado);
  }

  get total() {
    return this.itens().length;
  }
}
