import React from "react";
import * as XLSX from "xlsx";
import AdministrativoCard from "../../components/cards/Adm.jsx";
import AlmoxidAgroCard from "../../components/cards/Almoxidagro.jsx";
import Agricolacard from "../../components/cards/Agricola.jsx";
import JuridicoCard from "../../components/cards/Juridico.jsx";
import EnfermagemCard from "../../components/cards/Enfermagem.jsx";
import AlmoxindCard from "../../components/cards/Almoxind.jsx";
import PcmiCard from "../../components/cards/Pcmi.jsx";
import LaboratorioCard from "../../components/cards/Laboratorio.jsx";
import FrotaCard from "../../components/cards/Frota.jsx";
import FaturamentoCard from "../../components/cards/Faturamento.jsx";
import RhCard from "../../components/cards/Rh.jsx";
import RefeitorioCard from "../../components/cards/Refeitorio.jsx";
import SegtrabCard from "../../components/cards/Seg.jsx";

// Mapeamento completo de IPs e números de série
const infoPorSetor = {
  Agrícola: { ip: "10.10.1.101", serie: "ZDDPBQAH4000K1Z" },
  Almoxidagro: { ip: "10.10.1.102", serie: "ZDDPBQAH7000WJV" },
  AlmoxInd: { ip: "10.10.1.103", serie: "ZER4BQAF500136W" },
  Enfermagem: { ip: "10.10.1.105", serie: "ZER4BQAG2000BKT" },
  Faturamento: { ip: "10.10.1.106", serie: "ZER4BQAF3009BVX" },
  Administrativo: { ip: "10.10.1.90", serie: "Canon" },
  Frota: { ip: "10.10.1.108", serie: "ZDDPB07J9103HWY" },
  Jurídico: { ip: "10.10.1.109", serie: "Canon" },
  Laboratório: { ip: "10.10.1.110", serie: "ZER4BQAG70006PP" },
  PCMI: { ip: "10.10.1.111", serie: "ZDDPB07K512FAWY" },
  Refeitório: { ip: "10.10.1.112", serie: "ZER4BQAF5001QCW" },
  RH: { ip: "10.10.1.113", serie: "Canon" },
  SEGTRAB: { ip: "10.10.1.114", serie: "ZER4BQADB04107D" },
};

function Teste() {
  const handleColetar = () => {
    const cards = document.querySelectorAll(".cont");
    const resultados = [];

    cards.forEach((card) => {
      const nomeSetor = card.querySelector("h2")?.innerText || "Setor Desconhecido";
      const linhas = card.querySelectorAll(".flex.justify-between");
      let impressoes = "Não encontrado";

      linhas.forEach((linha) => {
        const label = linha.querySelector("strong")?.innerText;
        if (label && label.includes("Total de Impressões")) {
          const valor = linha.querySelectorAll("span")[1]?.innerText;
          impressoes = valor || "Não encontrado";
        }
      });

      const info = infoPorSetor[nomeSetor] || { ip: "Desconhecido", serie: "Desconhecido" };

      resultados.push({
        Setor: nomeSetor,
        "Total de Impressões": impressoes,
        IP: info.ip,
        "Número de Série": info.serie,
      });
    });

    const ws = XLSX.utils.json_to_sheet(resultados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Impressoras");

    ws["!cols"] = [
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 25 },
    ];

    XLSX.writeFile(wb, "relatorio_impressoras_completo.xlsx");
  };

  return (
    <div>
      <button onClick={handleColetar} style={{ margin: "15px", padding: "7px" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-file-earmark-spreadsheet-fill" viewBox="0 0 16 16">
          <path d="M6 12v-2h3v2z" />
          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M3 9h10v1h-3v2h3v1h-3v2H9v-2H6v2H5v-2H3v-1h2v-2H3z" />
        </svg>{" "}
        Exportar
      </button>
<p>new</p>
      <div className="containerPrints">
        <AdministrativoCard />
        <AlmoxidAgroCard />
        <Agricolacard />
        <JuridicoCard />
        <EnfermagemCard />
        <AlmoxindCard />
        <PcmiCard />
        <LaboratorioCard />
        <FrotaCard />
        <FaturamentoCard />
        <RhCard />
        <RefeitorioCard />
        <SegtrabCard />
      </div>
    </div>
  );
}

export default Teste;
