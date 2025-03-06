import { Component, OnInit } from '@angular/core';
import { BaixaService } from '../../shared/services/baixa.service';
import { ProductService } from '../../shared/services/product.service';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { EstoqueService } from '../../shared/services/estoque.service';




@Component({
  selector: 'app-registro-baixas',
  templateUrl: './registro-baixas.component.html',
  styleUrls: ['./registro-baixas.component.scss']
})
export class RegistroBaixasComponent implements OnInit {
  baixas: any[] = [];
  baixasFiltradas: any[] = [];
  searchTerm: string = '';

  constructor(private baixaService: BaixaService, private produtoService: ProductService,private firestore: Firestore,private estoqueService: EstoqueService ) {}


  ngOnInit(): void {
    this.carregarBaixas(); // ✅ Agora está pegando da coleção "estoques"
  }
  

  async carregarBaixas() {
    this.baixaService.getBaixas().subscribe(async (data) => {
      console.log("📥 Dados das baixas recebidos do Firestore:", data);
  
      this.baixas = await Promise.all(
        data.map(async (baixa) => {
          const estoque = baixa.produto ? await this.baixaService.getEstoqueById(baixa.produto) : null;
          const usuario = baixa.usuario ? await this.baixaService.getUserById(baixa.usuario) : { name: 'Não informado' };
  
          return {
            ...baixa,
            imagemProduto: estoque?.['imagemProduto'] || 'assets/imgs/default.png',
            name: estoque?.['name'] || 'Desconhecido',
            qtd: baixa.qtd || 0,
            usuario: usuario?.['name'] || 'Não informado',

            created_at: baixa.created_at
              ? new Date(baixa.created_at.seconds * 1000)
              : new Date(),
          };
        })
      );
  
      console.log("📌 Baixas processadas:", this.baixas);
      this.baixasFiltradas = [...this.baixas]; // Atualiza a exibição
    });
  }
  
  
  
  
  filtrarBaixas() {
    this.baixasFiltradas = this.baixas.filter((baixa) =>
      baixa.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  

  async atualizarBaixa(baixa: any) {
    try {
      const baixaRef = doc(this.firestore, 'baixas', baixa.id);
      await setDoc(baixaRef, { qtd: baixa.qtd }, { merge: true });
  
      alert('Quantidade atualizada com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      alert('Erro ao atualizar quantidade.');
    }
  }
  async atualizarQuantidade(baixa: any) {
    try {
      const estoqueRef = doc(this.firestore, 'estoques', baixa.id);
      await setDoc(estoqueRef, { qtd: baixa.qtd }, { merge: true });
  
      console.log('Quantidade atualizada no Firestore:', baixa.qtd);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  }
  
  
}
