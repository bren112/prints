import React, { useState } from "react";
import axios from "axios";
import img from './img.png';

function RhCard() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [mostrar, setMostrar] = useState(false);

  const executarRh = () => {
    if (mostrar) {
      setMostrar(false);
      return;
    }

    setCarregando(true);
    setErro(null);

    axios.get("http://10.10.10.242:5000/rh")
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
      <h2 className="text-xl font-bold mb-4 text-center">RH</h2>
      <img src={img} alt="" />
      <button
        onClick={executarRh}
        className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition w-full"
        disabled={carregando}
      >
        {carregando ? "Carregando..." : mostrar ? "Esconder" : "Ver RH"}
      </button>
      <br/>

      {erro && <p className="mt-4 text-red-500 text-center">{erro}</p>}

      {mostrar && dados && (
        <div className="mt">
          <div className="flex justify-between">
            <span><strong>Total de Impressões: </strong></span>
            <span>{dados.total_valor ?? dados.valor_coletado ?? "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span><strong>Último Usuário: </strong></span>
            <span>{dados.ultimo_usuario ?? "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span><strong>Valor Mensal: </strong></span>
            <span>{dados.valor_mensal ?? "N/A"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RhCard;
