import { Component, OnInit } from '@angular/core';
import { EstoqueService } from '../../shared/services/estoque.service';
import { ProductService } from '../../shared/services/product.service';
import { addDoc, collection, deleteDoc, doc, Firestore, setDoc, Timestamp } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, getStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {
  estoques: any[] = [];
  estoquesFiltrados: any[] = [];
  searchTerm: string = '';
  mostrarOpcoesOrdenacao: boolean = false;
  mostrarModal: boolean = false;
  imagemPreview: string | null = null;
  imagemArquivo: File | null = null;



  novoProduto = {
    name: '',
    category: '',
    brand: '',
    description: '',
    image: '',
    lote: '',
    qtd: 0
  };
  


  constructor(private estoqueService: EstoqueService, private produtoService: ProductService,private firestore: Firestore, private storage: Storage) {}

  ngOnInit(): void {
    this.carregarEstoque();
  }

  async carregarEstoque() {
    this.estoqueService.getEstoques().subscribe(async (data) => {
      console.log("Dados do Firestore:", data);
  
      this.estoques = await Promise.all(
        data.map(async (estoque) => {
          const produto = estoque.produto
            ? await this.produtoService.getProductById(estoque.produto)
            : null;
  
          return {
            ...estoque,
            imagemProduto: produto?.image || 'assets/imgs/default.png',
            lote: estoque.lote || 'Sem lote',
            qtd: estoque.qtd || 0,
            created_at: estoque.created_at
            ? (typeof estoque.created_at === 'number' 
                ? new Date(estoque.created_at)  // Se for número, converte diretamente
                : new Date(estoque.created_at.seconds * 1000)) // Se for Timestamp, converte corretamente
            : new Date(), // Se não existir, define como a data atual
          
            usuario: estoque.last_edition?.user || "Não informado", // 🔹 Último usuário que editou
          };
        })
      );
  
      console.log("Estoques processados:", this.estoques);
      this.estoquesFiltrados = [...this.estoques];
    });
  }
  
  
  
  
  filtrarEstoques() {
    this.estoquesFiltrados = this.estoques.filter(estoque =>
      estoque.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ordenarEstoques(criterio: string) {
    switch (criterio) {
      case 'dataAsc':
        this.estoquesFiltrados.sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
        break;
      case 'dataDesc':
        this.estoquesFiltrados.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
        break;
      case 'alfabeticaAsc':
        this.estoquesFiltrados.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alfabeticaDesc':
        this.estoquesFiltrados.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
  }

  abrirModalCriarProduto() {
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
  }

  selecionarImagem(event: any) {
    const arquivoSelecionado = event.target.files[0];
  
    if (arquivoSelecionado) { 
      this.imagemArquivo = arquivoSelecionado; // Garante que não seja null
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagemPreview = e.target.result;
      };
      reader.readAsDataURL(arquivoSelecionado);
    }
  }
  

  // Método para salvar o produto com a imagem
  async salvarProduto() {
    if (this.novoProduto.name && this.novoProduto.category && this.novoProduto.brand && this.novoProduto.lote && this.novoProduto.qtd > 0) {
      try {
        let imageUrl = '';
  
        // 🔹 Se houver imagem, fazer o upload para o Firebase Storage
        if (this.imagemArquivo) {
          const storage = getStorage();
          const filePath = `produtos/${this.imagemArquivo.name}`;
          const fileRef = ref(storage, filePath);
  
          await uploadBytes(fileRef, this.imagemArquivo);
          imageUrl = await getDownloadURL(fileRef);
        }
  
        const estoquesRef = collection(this.firestore, 'estoques');
        const produtoData = {
          name: this.novoProduto.name,
          category: this.novoProduto.category,
          brand: this.novoProduto.brand,
          lote: this.novoProduto.lote,
          qtd: this.novoProduto.qtd,
          image: imageUrl || '', // 🔹 Se não houver imagem, deixar vazio
          created_at: Timestamp.now()
        };
  
        await addDoc(estoquesRef, produtoData);
  
        alert('Produto salvo no estoque com sucesso!');
        this.fecharModal();
        this.carregarEstoque(); // Atualiza a lista
      } catch (error) {
        console.error('Erro ao salvar produto no estoque:', error);
        alert('Erro ao salvar produto no estoque.');
      }
    } else {
      alert('Preencha todos os campos obrigatórios.');
    }
  }
  

  
async moverParaProdutos(estoque: any) {
  try {
      const produtosRef = collection(this.firestore, 'produtos');
      const produtoRef = doc(produtosRef, estoque.id); // Criando um doc com o mesmo ID
      
      await setDoc(produtoRef, {
          ...estoque,
          created_at: Timestamp.now()
      });

      // Deletando do estoque após mover para produtos
      await deleteDoc(doc(this.firestore, 'estoques', estoque.id));

      alert('Produto movido para a lista de produtos!');
      this.carregarEstoque(); // Atualiza a lista
  } catch (error) {
      console.error('Erro ao mover produto:', error);
      alert('Erro ao mover produto.');
  }
}

}
