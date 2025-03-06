import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstoqueInterface } from '../../../shared/interfaces/estoque.interface';
import { EstoqueService } from '../../../shared/services/estoque.service';



@Component({
  selector: 'app-editar-produto',
  templateUrl: './editar-produto.component.html',
  styleUrls: ['./editar-produto.component.scss']
})
export class EditarProdutoComponent implements OnInit {
  estoque: EstoqueInterface | null = null;
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estoqueService: EstoqueService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.carregarProduto();
  }

  async carregarProduto() {
    this.estoque = await this.estoqueService.getEstoqueById(this.id);
  }
  

  salvarAlteracoes() {
    if (this.estoque) {
      this.estoqueService.updateEstoque(this.id, this.estoque).then(() => {
        alert('Produto atualizado com sucesso!');
        this.router.navigate(['/estoque']);
      });
    }
  }
}
