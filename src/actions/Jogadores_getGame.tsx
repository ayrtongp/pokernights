import { notifyError, notifySuccess } from "@/utils/functions";

export default async function Jogadores_getGame(jogo_id: string) {
  try {
    const response = await fetch('/api/Controller/Jogadores?type=getGame&jogo_id=' + jogo_id);

    if (!response.ok) {
      notifyError('Falha ao buscar jogadores')
      throw new Error('Falha ao buscar jogadores');
    }

    const data = await response.json();
    return data; // Retorna os dados do jogo adicionado
  } catch (error) {
    throw error; // Relança o erro para tratamento adicional se necessário
  }
}