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

// Mapeamento de IPs por setor
const ipPorSetor = {
  Administrativo: "10.10.1.90",
  Almoxidagro: "10.10.1.102",
  Agrícola: "10.10.1.101",
  Jurídico: "10.10.1.109",
  Enfermagem: "10.10.1.105",
  AlmoxInd: "10.10.1.103",
  PCMI: "10.10.1.111",
  Laboratório: "10.10.1.110",
  Frota: "10.10.1.108",
  Faturamento: "10.10.1.106",
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

      resultados.push({
        Setor: nomeSetor,
        "Total de Impressões": impressoes,
        IP: ipPorSetor[nomeSetor] || "Desconhecido",
      });
    });

    // Geração da planilha Excel
    const ws = XLSX.utils.json_to_sheet(resultados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Impressões");

    // Estilo: Define largura das colunas
    ws["!cols"] = [{ wch: 20 }, { wch: 25 }, { wch: 20 }];

    XLSX.writeFile(wb, "relatorio_impressoras.xlsx");
  };

  return (
    <div>
      <button onClick={handleColetar} style={{ margin: "15px", padding: "7px" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-file-earmark-spreadsheet-fill" viewBox="0 0 16 16">
          <path d="M6 12v-2h3v2z" />
          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M3 9h10v1h-3v2h3v1h-3v2H9v-2H6v2H5v-2H3v-1h2v-2H3z" />
        </svg>{" "}
        Exportar Excel
      </button>

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
      </div>
    </div>
  );
}

export default Teste;
