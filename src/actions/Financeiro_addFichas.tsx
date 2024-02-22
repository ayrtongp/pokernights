import { notifyError, notifySuccess } from "@/utils/functions";

export default async function Financeiro_addFichas(params: object) {
    try {
        const response = await fetch('/api/Controller/Financeiro?type=new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            notifyError('Falha ao adicionar novo jogo')
            throw new Error('Falha ao adicionar novo jogo');
        }

        const data = await response.json();
        return { data, responseOk: response.ok }; // Retorna os dados do jogo adicionado
    } catch (error) {
        console.error('Erro ao adicionar novo jogo:', error);
        throw error; // Relança o erro para tratamento adicional se necessário
    }
}