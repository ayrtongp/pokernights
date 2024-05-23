import { notifyError, notifySuccess } from "@/utils/functions";

const dbName = 'Financeiro'

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

export async function Financeiro_deleteId(despesaId: string) {
    try {
        const response = await fetch('/api/Controller/Financeiro?type=deleteId&despesaId=' + despesaId, {
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

export default async function Financeiro_POST_despesaCompartilhada(params: object) {
    const type = 'despesaCompartilhada'
    const url = `/api/Controller/${dbName}?type=${type}`
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            notifyError('Falha ao adicionar - despesa compartilhada')
            throw new Error('Falha ao adicionar - despesa compartilhada');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao adicionar - despesa compartilhada:', error);
        throw error;
    }
}