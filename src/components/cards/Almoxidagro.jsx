import React, { useState } from "react";
import axios from "axios";
import img from './img.png';
function AlmoxidAgroCard() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [mostrar, setMostrar] = useState(false); // controla se mostra os dados

  const executarAlmoxidAgro = () => {
    if (mostrar) {
      setMostrar(false);
      return;
    }

    setCarregando(true);
    setErro(null);

    axios.get("http://10.10.10.242:5000/almoxidAgro")
      .then(res => {
        setDados(res.data);
        setMostrar(true);
      })
      .catch(() => {
        setErro("Erro ao coletar dados");
      })
      .finally(() => {
        setCarregando(false);
      });
  };

  return (
    <div className="cont" >
      <h2 className="text-xl font-bold mb-4 text-center">Almoxidagro</h2>
      <img src={img} alt="" srcset="" />

      <button
        onClick={executarAlmoxidAgro}
        className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition w-full"
        disabled={carregando}
      >
        {carregando ? "Carregando..." : mostrar ? "Esconder" : "Ver AlmoxidAgro"}
   

      </button>
      <br/>

      {erro && <p className="mt-4 text-red-500 text-center">{erro}</p>}

      {mostrar && dados && (
        <div className="mt">
          <div className="flex justify-between">
            <span><strong>Total de Impressões: </strong></span>
            <span>{dados.valor_coletado}</span>
          </div>
          <div className="flex justify-between">
            <span><strong>Valor Mensal: </strong></span>
            <span>{dados.valor_mensal}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlmoxidAgroCard;
