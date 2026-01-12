import { Component, signal, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './lista.html',
  styleUrl: './lista.scss',
})
export class Lista implements OnDestroy {
  private http = inject(HttpClient);

  novoItem: string = '';
  itens = signal<{ nome: string; comprado: boolean }[]>([]);

  constructor() {
    this.http.get<{ nome: string; comprado: boolean }[]>('/api/lista').subscribe(data => {
      this.itens.set(data ?? []);
    });
  }

  ngOnDestroy() {
    // nothing to cleanup
  }

  salvar() {
    this.http.put('/api/lista', this.itens()).subscribe();
  }

  adicionar() {
    if (this.novoItem.trim() === '') return;
    this.itens.update(lista => [...lista, { nome: this.novoItem.trim(), comprado: false }]);
    this.novoItem = '';
    this.salvar();
  }

  remover(index: number) {
    this.itens.update(lista => lista.filter((_, i) => i !== index));
    this.salvar();
  }

  alternarComprado(index: number) {
    this.itens.update(lista =>
      lista.map((item, i) => i === index ? { ...item, comprado: !item.comprado } : item)
    );
    this.salvar();
  }

  get total() {
    return this.itens().length;
  }
}
