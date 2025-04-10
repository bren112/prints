import React, { useState } from "react";
import axios from "axios";
import img from './img.png';
function AdministrativoCard() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [mostrar, setMostrar] = useState(false); // controla exibição

  const executarAdministrativo = () => {
    if (mostrar) {
      setMostrar(false);
      return;
    }

    setCarregando(true);
    setErro(null);

    axios.get("http://localhost:5000/administrativo")
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

  const calcularMensal = (total) => {
    if (!total || typeof total !== "string") return 0;
    const numero = parseInt(total.replace(/\D/g, ""), 10);
    return numero - 43980;
  };
  

  return (
    <div className="cont">
      <h2 className="text-xl font-bold mb-4 text-center">Administrativo</h2>
      <img src={img} alt="" srcset="" />

      <button
        onClick={executarAdministrativo}
        className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition w-full"
        disabled={carregando}
      >
        {carregando ? "Carregando..." : mostrar ? "Esconder" : "Ver ADM"}
      </button>
      <br/>

      {erro && <p className="mt-4 text-red-500 text-center">{erro}</p>}

      {mostrar && dados && (
        <div className="mt">
          <div className="flex justify-between">
            <span><strong>Total de Impressões: </strong></span>
            <span>{dados.total_valor}</span>
          </div>
          <div className="flex justify-between">
            <span><strong>Último Usuário:</strong></span>
            <span>{dados.ultimo_usuario}</span>
          </div>
          <div className="flex justify-between">
            <span><strong>Valor Mensal: </strong></span>
            <span>{calcularMensal(dados.total_valor)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdministrativoCard;
