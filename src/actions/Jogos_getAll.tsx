import { notifyError, notifySuccess } from "@/utils/functions";

export default async function Jogos_getAll() {
  try {
    const response = await fetch('/api/Controller/Jogos?type=getAll');

    if (!response.ok) {
      notifyError('Falha ao buscar jogos')
      throw new Error('Falha ao buscar jogos');
    }

    const data = await response.json();
    return data; // Retorna os dados do jogo adicionado
  } catch (error) {
    throw error; // Relança o erro para tratamento adicional se necessário
  }
}