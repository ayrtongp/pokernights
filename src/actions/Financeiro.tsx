import { notifyError, notifySuccess } from "@/utils/functions";

export async function Financeiro_getGame(jogoId: string) {
    try {
        const response = await fetch('/api/Controller/Financeiro?type=getGame&jogo_id=' + jogoId);

        if (!response.ok) {
            notifyError('Falha ao buscar financeiro')
            throw new Error('Falha ao buscar financeiro');
        }

        const data = await response.json();
        return { data, responseOk: response.ok }; // Retorna os dados do jogo adicionado
    } catch (error) {
        throw error; // Relança o erro para tratamento adicional se necessário
    }
}

export async function Financeiro_deleteGame(jogoId: string) {
    try {
        const response = await fetch('/api/Controller/Financeiro?type=deleteGame&jogoId=' + jogoId, {
            method: 'DELETE', // Especifica que o método HTTP é DELETE
        });

        if (!response.ok) {
            throw new Error('Falha ao deletar financeiro');
        }

        const data = await response.json();
        return { data, responseOk: response.ok }; // Retorna os dados do jogo adicionado
    } catch (error) {
        throw error; // Relança o erro para tratamento adicional se necessário
    }
}