import { Component, OnInit } from '@angular/core';
import { BaixaService } from '../../shared/services/baixa.service';
import { ProductService } from '../../shared/services/product.service';




@Component({
  selector: 'app-registro-baixas',
  templateUrl: './registro-baixas.component.html',
  styleUrls: ['./registro-baixas.component.scss']
})
export class RegistroBaixasComponent implements OnInit {
  baixas: any[] = [];
  baixasFiltradas: any[] = [];
  searchTerm: string = '';

  constructor(private baixaService: BaixaService, private produtoService: ProductService) {}


  ngOnInit(): void {
    this.carregarBaixas();
  }

  async carregarBaixas() {
    this.baixaService.getBaixas().subscribe(async (data) => {
      this.baixas = await Promise.all(
        data.map(async (baixa) => {
          const estoque = await this.baixaService.getEstoqueById(baixa.estoque);
          const produto = estoque ? await this.produtoService.getProductById(estoque['produto']) : null;
          const usuario = await this.baixaService.getUserById(baixa.user);
          
          return {
            ...baixa,
            estoqueNome: estoque ? estoque['name'] : 'Desconhecido',
            usuarioEmail: usuario ? usuario['email'] : 'Desconhecido',
            imagemProduto: produto ? produto['image'] : 'assets/imgs/default.png', // Caminho padrão
            type: produto ? produto['category'] : 'Sem tipo',
            brand: produto ? produto['brand'] : 'Sem marca'
          };
        })
      );
      this.baixasFiltradas = [...this.baixas];
    });
  }
  
  
  

  filtrarBaixas() {
    this.baixasFiltradas = this.baixas.filter((baixa) =>
      baixa.estoqueNome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
