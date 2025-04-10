import { useState, useEffect } from "react";
import supabase from '../../supabaseclient'; // Importando o cliente Supabase
import './home.css';
import img from './img.png';
import { ClipLoader } from 'react-spinners'; // Importando o spinner da biblioteca

function Home() {
  const [dados, setDados] = useState(null);
  const [dadosSupa, setDadosSupa] = useState(null);
  const [dadosAlmoxid, setDadosAlmoxid] = useState(null);
  const [dadosAlmoxind, setDadosAlmoxind] = useState(null);
  const [dadosRH, setDadosRH] = useState(null);
  const [dadosAgricola, setDadosAgricola] = useState(null);  
  const [dadosRefeitorio, setDadosRefeitorio] = useState(null);  
  const [dadosJuridico, setDadosJuridico] = useState(null); 
  const [dadosEnfermagem, setDadosEnfermagem] = useState(null); 
  const [dadosLabo, setDadosLabo] = useState(null); 
  const [dadosPcmi, setDadosPcmi] = useState(null); 
  const [dadosFrota, setDadosFrota] = useState(null); 
  const [dadosFatu, setDadosFatu] = useState(null); 
  const [dadosSeg, setDadosSeg] = useState(null); 

  const [carregando, setCarregando] = useState(false);
  const [carregandoSupa, setCarregandoSupa] = useState(false);
  const [impressoraSelecionada, setImpressoraSelecionada] = useState(null);
  const [exibirDetalhes, setExibirDetalhes] = useState(false);
  const [pesquisa, setPesquisa] = useState(""); // Estado para armazenar o termo de pesquisa

  const buscarDados = () => {
    setCarregando(true);
    fetch("http://localhost:2000/dados")
      .then((res) => res.json())
      .then((data) => {
        setDados(data);
        buscarDadosSupabase();
      })
      .catch((err) => console.error("Erro ao buscar dados:", err))
      .finally(() => setCarregando(false));

    fetch("http://localhost:2000/almoxidagro")
      .then((res) => res.json())
      .then((data) => {
        setDadosAlmoxid(data);
      })
      .catch((err) => console.error("Erro ao buscar dados do almoxidAgro:", err));

    fetch("http://localhost:2000/rh")
      .then((res) => res.json())
      .then((data) => {
        setDadosRH(data);
      })
      .catch((err) => console.error("Erro ao buscar dados do RH:", err));

    fetch("http://localhost:2000/agricola") 
      .then((res) => res.json())
      .then((data) => {
        setDadosAgricola(data);  
      })
      .catch((err) => console.error("Erro ao buscar dados do Setor Agrícola:", err));

    fetch("http://localhost:2000/refeitorio") 
      .then((res) => res.json())
      .then((data) => {
        setDadosRefeitorio(data);  
      })
      .catch((err) => console.error("Erro ao buscar dados do Setor Refeitório:", err));

    fetch("http://localhost:2000/juridico") 
      .then((res) => res.json())
      .then((data) => {
        setDadosJuridico(data);  
      })
      .catch((err) => console.error("Erro ao buscar dados do Setor Juridico:", err));

    fetch("http://localhost:2000/enfermagem") 
      .then((res) => res.json())
      .then((data) => {
        setDadosEnfermagem(data);  
      })
      .catch((err) => console.error("Erro ao buscar dados do Setor Enfermagem:", err));

    fetch("http://localhost:2000/almoxind") 
      .then((res) => res.json())
      .then((data) => {
        setDadosAlmoxind(data);  
      })
      .catch((err) => console.error("Erro ao buscar dados do Setor Almoxind:", err));

    fetch("http://localhost:2000/pcmi") 
      .then((res) => res.json())
      .then((data) => {
        setDadosPcmi(data);  
      })
      .catch((err) => console.error("Erro ao buscar dados do Setor PCMI:", err));

    fetch("http://localhost:2000/labo") 
      .then((res) => res.json())
      .then((data) => {
        setDadosLabo(data);  
      })
      .catch((err) => console.error("Erro ao buscar dados do Setor lABORATÓRIO:", err));

    fetch("http://localhost:2000/frota") 
      .then((res) => res.json())
      .then((data) => {
        setDadosFrota(data);  
      })
      .catch((err) => console.error("Erro ao buscar dados do Setor FROTA:", err));

    fetch("http://localhost:2000/fatu") 
      .then((res) => res.json())
      .then((data) => {
        setDadosFatu(data);  
      })
      .catch((err) => console.error("Erro ao buscar dados do Setor lABORATÓRIO:", err));

    fetch("http://localhost:2000/seg") 
      .then((res) => res.json())
      .then((data) => {
        setDadosSeg(data);  
      })
      .catch((err) => console.error("Erro ao buscar dados do Setor SEGTRAB:", err));
  };

  const buscarDadosSupabase = async () => {
    setCarregandoSupa(true);
    try {
      const { data, error } = await supabase.from('impressoras').select('*').order('data_atual', { ascending: false });
      if (error) {
        console.error("Erro ao buscar dados do Supabase:", error);
        return;
      }
      setDadosSupa(data[0]);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setCarregandoSupa(false);
    }
  };

  const atualizarTudo = () => {
    setCarregando(true);
    setCarregandoSupa(true);
    buscarDados();
    buscarDadosSupabase();
  };

  const formatarData = (data) => {
    if (!data) return "";
    const dataObj = new Date(data);
    return dataObj.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  };

  const toggleDetalhes = (impressora) => {
    setImpressoraSelecionada(impressora);
    setExibirDetalhes(!exibirDetalhes);
  };

  useEffect(() => {
    buscarDados();
    buscarDadosSupabase();
  }, []);

  const combinarDados = () => {
    const dadosCombinados = [
      dados,
      dadosAlmoxid,
      dadosRH,
      dadosAgricola,
      dadosRefeitorio,
      dadosJuridico,
      dadosEnfermagem,
      dadosAlmoxind,
      dadosPcmi,
      dadosLabo,
      dadosFrota,
      dadosFatu,
      dadosSeg
    ].filter(item => item !== null);
  
    // Garantir que cada impressora seja única com base em 'nome' e 'numero'
    const dadosUnicos = [];
    const nomesUnicos = new Set();
  2000
    dadosCombinados.forEach(item => {
      const chaveUnica = item.nome + item.numero;
      if (!nomesUnicos.has(chaveUnica)) {
        nomesUnicos.add(chaveUnica);
        dadosUnicos.push(item);
      }
    });
  
    return dadosUnicos;
  };

  // Filtrar dados com base no termo de pesquisa
  const filtrarDados = () => {
    const dadosFiltrados = combinarDados().filter((impressora) => {
      return impressora.nome.toLowerCase().includes(pesquisa.toLowerCase());
    });
    return dadosFiltrados;
  };

  return (
    <>
      <br />
      <h1>CONTROLE IMPRESSORAS</h1>
      <div className="subheader">
      <div className="container">
        <button onClick={atualizarTudo} disabled={carregando || carregandoSupa}>
          {carregando || carregandoSupa ? "Atualizando tudo..." : "Atualizar Tudo"}
        </button>
      </div>
     
      <div className="pesquisa">
        <input
          type="text"
          placeholder="Pesquisar impressora..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </div></div>

      <div className="world">
        {(carregando || carregandoSupa) && (
          <div className="overlay">
            <ClipLoader color="green" size={50} />
          </div>
        )}

        {/* Exibir dados das impressoras filtradas */}
        {filtrarDados().map((dados, index) => (
          dados && (
            <div key={index} className="container">
              <div className="impressora">
                <div className="esq">
                  <img src={img} alt="" />
                </div>
                <div className="dir">
                  <h1><span>{dados.nome}</span></h1>
                  <button onClick={() => toggleDetalhes(dados.nome)}>Controle</button>
                </div>
              </div>
            </div>
          )
        ))}

        {exibirDetalhes && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setExibirDetalhes(false)}>&times;</span>
              {filtrarDados().map((dados, index) => (
                impressoraSelecionada === dados?.nome && dados && (
                  <div key={index}>
                    <p><strong>Nome: </strong>{dados.nome}</p>
                    <p>Total: {dados.prints} <span>{dados.numero}</span></p>
                    <p><strong>Última atualização: </strong>{formatarData(dados.data_atual)}</p>
                    <p><strong>Última pessoa que imprimiu: </strong>{dados.ult}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
