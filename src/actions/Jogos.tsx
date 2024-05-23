import { notifyError, notifySuccess } from "@/utils/functions";

export async function Jogos_deleteGame(jogoId: string) {
    try {
        const response = await fetch('/api/Controller/Jogos?type=deleteGame&jogoId=' + jogoId, {
            method: 'DELETE', // Especifica que o método HTTP é DELETE
        });

        if (!response.ok) {
            notifyError('Falha ao deletar jogo')
            throw new Error('Falha ao deletar jogo');
        }

        const data = await response.json();
        return { data, responseOk: response.ok }; // Retorna os dados do jogo adicionado
    } catch (error) {
        throw error; // Relança o erro para tratamento adicional se necessário
    }
}