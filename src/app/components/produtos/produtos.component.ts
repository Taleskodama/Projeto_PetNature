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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.productService.getProducts().subscribe((data) => {
      this.produtos = data;
    });
  }
}
