import React, { useState } from "react";
import axios from "axios";
import img from './img.png';

function SegtrabCard() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [mostrar, setMostrar] = useState(false);

  const executarSegtrab = () => {
    if (mostrar) {
      setMostrar(false);
      return;
    }

    setCarregando(true);
    setErro(null);

    axios.get("http://localhost:5000/segtrab")
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
      <h2 className="text-xl font-bold mb-4 text-center">SEGTRAB</h2>
      <img src={img} alt="segtrab" />
      <button
        onClick={executarSegtrab}
        className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition w-full"
        disabled={carregando}
      >
        {carregando ? "Carregando..." : mostrar ? "Esconder" : "Ver SEGTRAB"}
      </button>
      <br />

      {erro && <p className="mt-4 text-red-500 text-center">{erro}</p>}

      {mostrar && dados && (
        <div className="mt space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span><strong>Total de Impressões:</strong></span>
            <span>{dados.valor_coletado ?? "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span><strong>Valor Mensal:</strong></span>
            <span>{dados.valor_mensal ?? "N/A"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SegtrabCard;
