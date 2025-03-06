import { Component, OnInit } from '@angular/core';
import { EstoqueService } from '../../shared/services/estoque.service';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {
  estoques: any[] = [];
  estoquesFiltrados: any[] = [];
  searchTerm: string = '';

  constructor(private estoqueService: EstoqueService, private produtoService: ProductService) {}

  ngOnInit(): void {
    this.carregarEstoque();
  }

  async carregarEstoque() {
    this.estoqueService.getEstoques().subscribe(async (data) => {
      this.estoques = await Promise.all(
        data.map(async (estoque) => {
          const produto = estoque ? await this.produtoService.getProductById(estoque['produto']) : null;
  
          return {
            ...estoque,
            imagemProduto: produto ? produto['image'] : 'assets/imgs/default.png', // Imagem do produto ou default
            lote: estoque.lote || 'Sem lote', // Garantindo que o campo exista
            created_at: estoque.created_at || new Date().getTime() // Definir timestamp se não existir
          };
        })
      );
      this.estoquesFiltrados = [...this.estoques];
    });
  }
  
  filtrarEstoques() {
    this.estoquesFiltrados = this.estoques.filter(estoque =>
      estoque.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
