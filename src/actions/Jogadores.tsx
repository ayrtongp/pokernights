export async function Jogadores_deleteGame(jogoId: string) {
    try {
        const response = await fetch('/api/Controller/Jogadores?type=deleteGame&jogoId=' + jogoId, {
            method: 'DELETE', // Especifica que o método HTTP é DELETE
        });

        if (!response.ok) {
            throw new Error('Falha ao buscar jogador');
        }

        const data = await response.json();
        return { data, responseOk: response.ok }; // Retorna os dados do jogo adicionado
    } catch (error) {
        throw error; // Relança o erro para tratamento adicional se necessário
    }
}