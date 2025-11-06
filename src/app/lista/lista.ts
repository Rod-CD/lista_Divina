import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista',
  imports: [FormsModule, CommonModule],
  templateUrl: './lista.html',
  styleUrl: './lista.scss',
})
export class Lista {
  novoItem: string = '';
  itens = signal<{ nome: string; comprado: boolean }[]>([]);

  constructor() {
  if (typeof window !== 'undefined') {  // ✅ garante que só roda no navegador
    const itensSalvos = localStorage.getItem('lista-compras');
    if (itensSalvos) {
      this.itens.set = JSON.parse(itensSalvos);
    }
  }
}

  salvar() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lista-compras', JSON.stringify(this.itens()));
    }
  }

  adicionar() {
    if (this.novoItem.trim() === '') return;

    this.itens.update(lista => [
      ...lista,
      { nome: this.novoItem.trim(), comprado: false }
    ]);

    this.novoItem = '';
    this.salvar();
  }

  remover(index: number) {
    this.itens.update(lista => lista.filter((_, i) => i !== index));
    this.salvar();
  }

  alternarComprado(index: number) {
    this.itens.update(lista =>
      lista.map((item, i) =>
        i === index ? { ...item, comprado: !item.comprado } : item
      )
    );
    this.salvar();
  }

  get total() {
    return this.itens().length;
  }
}
