import { Component, signal, inject, OnDestroy, Injector, runInInjectionContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Database, ref, set, onValue, off } from '@angular/fire/database';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './lista.html',
  styleUrl: './lista.scss',
})
export class Lista implements OnDestroy {
  private db = inject(Database);
  private injector = inject(Injector);
  private listaRef = ref(this.db, 'lista');
  private unsubscribe: (() => void) | undefined;

  novoItem: string = '';
  itens = signal<{ nome: string; comprado: boolean }[]>([]);

  constructor() {
    runInInjectionContext(this.injector, () => {
      this.unsubscribe = onValue(this.listaRef, (snapshot) => {
        this.itens.set(snapshot.val() ?? []);
      });
    });
  }

  ngOnDestroy() {
    if (this.unsubscribe) off(this.listaRef);
  }

  salvar() {
    set(this.listaRef, this.itens());
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
