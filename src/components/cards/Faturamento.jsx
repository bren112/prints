import React, { useState } from "react";
import axios from "axios";
import img from './img.png';

function FaturamentoCard() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [mostrar, setMostrar] = useState(false);

  const executarFaturamento = () => {
    if (mostrar) {
      setMostrar(false);
      return;
    }

    setCarregando(true);
    setErro(null);

    axios.get("http://10.10.10.242:5000/faturamento")
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
    <div className="cont">
      <h2 className="text-xl font-bold mb-4 text-center">Faturamento</h2>
      <img src={img} alt="faturamento" />
      <button
        onClick={executarFaturamento}
        className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition w-full"
        disabled={carregando}
      >
        {carregando ? "Carregando..." : mostrar ? "Esconder" : "Ver Faturamento"}
      </button>
      <br/>

      {erro && <p className="mt-4 text-red-500 text-center">{erro}</p>}

      {mostrar && dados && !dados.erro && (
        <div className="mt">
          <div className="flex justify-between">
            <span><strong>Total de Impressões:</strong></span>
            <span>{dados.valor_coletado}</span>
          </div>
          <div className="flex justify-between">
            <span><strong>Valor Mensal:</strong></span>
            <span>{dados.valor_mensal}</span>
          </div>
        </div>
      )}

      {dados?.erro && (
        <p className="mt-4 text-red-600 text-center">{dados.erro}</p>
      )}
    </div>
  );
}

export default FaturamentoCard;
