import { Component, OnInit } from '@angular/core';
import { EstoqueService } from '../../shared/services/estoque.service';
import { ProductService } from '../../shared/services/product.service';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, getStorage } from '@angular/fire/storage';
import { AuthService } from '../../shared/services/auth.service';

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
  mostrarModalExcluir: boolean = false;
  produtoSelecionadoParaExcluir: string | null = null;


  novoProduto = {
    name: '',
    category: '',
    brand: '',
    description: '',
    image: '',
    lote: '',
    qtd: 0
  };

  constructor(private estoqueService: EstoqueService, private produtoService: ProductService, private firestore: Firestore, private storage: Storage,private authService: AuthService ) {}

  ngOnInit(): void {
    this.carregarEstoque();
  }

  async carregarEstoque() {
    this.estoqueService.getEstoques().subscribe(async (data) => {
      console.log("📥 Estoques carregados do Firestore:", data);
  
      this.estoques = await Promise.all(
        data.map(async (estoque) => {
          const produto = estoque.produto
            ? await this.produtoService.getProductById(estoque.produto)
            : null;
  
          return {
            ...estoque,
            imagemProduto: estoque.image && typeof estoque.image === 'string' && estoque.image.startsWith("http")
              ? estoque.image 
              : 'assets/imgs/Foto_Produto.png', // ✅ Define imagem padrão caso não tenha imagem
            lote: Number(estoque.lote) || 0, // ✅ Garante que seja número
            qtd: Number(estoque.qtd) || 0, // ✅ Garante que seja número
            created_at: Number(estoque.created_at) || Date.now(), // ✅ Garante que seja número
            usuario: estoque.last_edition?.user || "Não informado",
          };
        })
      );
  
      console.log("📌 Estoques processados:", this.estoques);
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
  
        // 🔹 Pegando o usuário logado e aguardando a resposta corretamente
        const usuarioAtual = await this.authService.getCurrentUser(); 
        
        if (!usuarioAtual || !usuarioAtual.uid) {
          console.error("Usuário não encontrado!");
          alert("Erro ao obter usuário logado.");
          return;
        }
  
        let userCode = "Desconhecido"; // Padrão caso não encontre
  
        // 🔹 Buscar o `code` do usuário logado no Firestore
        const usersRef = collection(this.firestore, "users");
        const q = query(usersRef, where("uid", "==", usuarioAtual.uid));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          userCode = querySnapshot.docs[0].data()['code']; // 🔹 Obtém o `code`
        } else {
          console.warn("Código do usuário não encontrado no Firestore.");
        }
  
        // 🔹 Criando o objeto do produto com o `code` do usuário logado
        const produtoData = {
          name: this.novoProduto.name,
          category: this.novoProduto.category,
          brand: this.novoProduto.brand,
          lote: Number(this.novoProduto.lote) || 0,
          qtd: Number(this.novoProduto.qtd) || 0,
          image: imageUrl || '', 
          created_at: Date.now(), 
          last_edition: { user: userCode } // 🔹 Agora salva o `code` corretamente
        };
  
        const estoquesRef = collection(this.firestore, 'estoques');
        await addDoc(estoquesRef, produtoData);
  
        alert('Produto salvo no estoque com sucesso!');
        this.fecharModal();
        this.carregarEstoque(); 
      } catch (error) {
        console.error('Erro ao salvar produto no estoque:', error);
        alert('Erro ao salvar produto no estoque.');
      }
    } else {
      alert('Preencha todos os campos obrigatórios.');
    }
  }
  
  
  
  
  
  
  

  abrirModalExcluirProduto() {
    this.mostrarModalExcluir = true;
  }
  
  fecharModalExcluirProduto() {
    this.mostrarModalExcluir = false;
  }
  
  async excluirProduto() {
    if (!this.produtoSelecionadoParaExcluir) {
      alert("Selecione um produto para excluir!");
      return;
    }
  
    try {
      // 🔹 Exclui primeiro da coleção "estoques"
      const estoqueRef = doc(this.firestore, 'estoques', this.produtoSelecionadoParaExcluir);
      await deleteDoc(estoqueRef);
      console.log(`Produto ${this.produtoSelecionadoParaExcluir} excluído da coleção 'estoques'`);
  
      // 🔹 Agora buscamos na coleção "produtos" um documento com o mesmo nome
      const produtosRef = collection(this.firestore, 'produtos');
      const q = query(produtosRef, where("name", "==", this.estoques.find(e => e.id === this.produtoSelecionadoParaExcluir)?.name));
      const querySnapshot = await getDocs(q);
  
      // 🔹 Se encontrarmos o produto, deletamos da coleção "produtos"
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (produtoDoc) => {
          const produtoRef = doc(this.firestore, 'produtos', produtoDoc.id);
          await deleteDoc(produtoRef);
          console.log(`Produto ${produtoDoc.id} excluído da coleção 'produtos'`);
        });
      } else {
        console.warn("Produto não encontrado na coleção 'produtos', apenas removido de 'estoques'.");
      }
  
      alert("Produto excluído com sucesso!");
      this.carregarEstoque(); // Atualiza a lista de produtos
      this.fecharModalExcluirProduto();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto.");
    }
  }
  

  async publicarProduto(estoque: any) {
    try {
      const produtosRef = collection(this.firestore, 'produtos');
  
      // Criando um novo documento na coleção "produtos"
      await addDoc(produtosRef, {
        name: estoque.name,
        category: estoque.category,
        brand: estoque.brand,
        lote: Number(estoque.lote) || 0, // ✅ Garante que seja número
        qtd: Number(estoque.qtd) || 0, // ✅ Garante que seja número
        image: estoque.imagemProduto || 'assets/imgs/default.png', // ✅ Define imagem padrão caso não tenha
        created_at: Date.now(), // ✅ Salva como timestamp
      });
  
      alert('Produto publicado com sucesso na coleção de produtos!');
    } catch (error) {
      console.error('Erro ao publicar produto:', error);
      alert('Erro ao publicar produto.');
    }
  }
  
  
}
