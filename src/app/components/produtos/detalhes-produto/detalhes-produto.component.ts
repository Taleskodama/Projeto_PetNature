import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductInterface } from '../../../shared/interfaces/product.interface';
import { ProductService } from '../../../shared/services/product.service';



@Component({
  selector: 'app-detalhes-produto',
  templateUrl: './detalhes-produto.component.html',
  styleUrls: ['./detalhes-produto.component.scss']
})
export class DetalhesProdutoComponent implements OnInit {
  produto: ProductInterface | null = null; // Permitir null inicialmente

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const produto = await this.productService.getProductById(id);
      if (produto) {
        this.produto = produto; // Apenas atribui se não for null
      } else {
        console.error("Produto não encontrado!");
      }
    }
  }
}

