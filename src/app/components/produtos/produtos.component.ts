import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../../shared/interfaces/product.interface';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
  produtos: ProductInterface[] = []; // Lista de produtos
  produtosFiltrados: ProductInterface[] = []; // Lista que será filtrada
  searchTerm: string = ''; // Termo de busca digitado pelo usuário
  ordenacao: string = ''; // Estado da ordenação

  filtroTipo: string = '';
  filtroMarca: string = '';
  filtroData: string = '';

  mostrarOpcoesOrdenacao: boolean = false;
  mostrarModalFiltro: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((produtos) => {
      this.produtos = produtos;
      this.produtosFiltrados = produtos; // Inicialmente, exibe todos os produtos
    });
  }

  carregarProdutos() {
    this.productService.getProducts().subscribe((data) => {
      this.produtos = data;
    });
  }

  filtrarProdutos(): void {
    this.produtosFiltrados = this.produtos.filter(produto => {
      const nomeFiltrado = produto.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const tipoFiltrado = this.filtroTipo ? produto.category.toLowerCase().includes(this.filtroTipo.toLowerCase()) : true;
      const marcaFiltrada = this.filtroMarca ? produto.brand.toLowerCase().includes(this.filtroMarca.toLowerCase()) : true;

      // 🔹 Convertendo timestamp para data no formato 'YYYY-MM-DD'
      const dataCadastro = new Date(produto.created_at).toISOString().split('T')[0];
      const dataFiltrada = this.filtroData ? dataCadastro === this.filtroData : true;

      return nomeFiltrado && tipoFiltrado && marcaFiltrada && dataFiltrada;
    });
  }

  resetarFiltros(): void {
    this.filtroTipo = '';
    this.filtroMarca = '';
    this.filtroData = '';
    this.filtrarProdutos();
    this.mostrarModalFiltro = false; // Fechar o modal ao resetar os filtros
  }

  ordenarProdutos(tipo: string): void {
    this.ordenacao = tipo; // Atualiza o estado da ordenação

    switch (tipo) {
      case 'dataAsc':
        this.produtosFiltrados.sort((a, b) => 
          (a.last_edition?.timestamp || 0) - (b.last_edition?.timestamp || 0)
        );
        break;
      case 'dataDesc':
        this.produtosFiltrados.sort((a, b) => 
          (b.last_edition?.timestamp || 0) - (a.last_edition?.timestamp || 0)
        );
        break;
      case 'alfabeticaAsc':
        this.produtosFiltrados.sort((a, b) => 
          (a.name || '').localeCompare(b.name || '')
        );
        break;
      case 'alfabeticaDesc':
        this.produtosFiltrados.sort((a, b) => 
          (b.name || '').localeCompare(a.name || '')
        );
        break;
    }
  }
}
