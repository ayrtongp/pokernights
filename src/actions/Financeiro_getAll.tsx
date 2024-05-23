import { notifyError, notifySuccess } from "@/utils/functions";

export default async function Financeiro_getAll() {
  try {
    const response = await fetch('/api/Controller/Financeiro?type=getAll');

    if (!response.ok) {
      notifyError('Falha ao buscar Financeiro')
      throw new Error('Falha ao buscar Financeiro');
    }

    const data = await response.json();
    return data; // Retorna os dados do jogo adicionado
  } catch (error) {
    throw error; // Relança o erro para tratamento adicional se necessário
  }
}