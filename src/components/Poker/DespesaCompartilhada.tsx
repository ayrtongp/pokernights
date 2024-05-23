import React, { useState } from 'react'
import TextInputM2 from '../Forms/TextInputM2';
import SelectInputM2 from '../Forms/SelectInputM2';
import CurrencyInput from 'react-currency-input-field';
import { notifyError, notifySuccess } from '@/utils/functions';
import Financeiro_POST_despesaCompartilhada from '@/actions/Financeiro';

interface Props {
    jogadores: Jogador[];
    jogoId: string;
    triggerFetch: any;
}

interface DespesaComp {
    valor: number;
    nome_jogador: string;
    jogador_id: string;
    jogo_id: string;
}

const DespesaCompartilhada = ({ jogadores, jogoId, triggerFetch }: Props) => {

    const [despesaCompartilhada, setDespesaCompartilhada] = useState<DespesaComp[]>([]);
    const [nomeJogadorDespesa, setNomeJogadorDespesa] = useState('');
    const [idJogadorDespesa, setIdJogadorDespesa] = useState('');
    const [valorDespesa, setValorDespesa] = useState(0);
    const [nomeDespesa, setNomeDespesa] = useState('');


    // ############
    // ############
    // HANDLERS
    // ############
    // ############

    const handleSelectInput = (e: any) => {
        setNomeJogadorDespesa(e.target.options[e.target.options.selectedIndex].innerText);
        setIdJogadorDespesa(e.target.value);
    }

    const handleChangeDes = (event: number, jogador: any) => {
        if (event < 0) {
            notifyError('Colocar apenas números positivos');
        } else if (event === 0) {
            setDespesaCompartilhada(prevState => {
                // Remova o jogador correspondente do array
                return prevState.filter(item => item.nome_jogador != jogador.nome_jogador);
            });
        } else {
            setDespesaCompartilhada(prevState => {
                // Atualize o valor do jogador correspondente ou adicione-o se ainda não existir no array
                const updatedArray = [...prevState];
                const index = updatedArray.findIndex(item => item.nome_jogador === jogador.nome_jogador);
                if (index !== -1) {
                    updatedArray[index].valor = event as number;
                } else {
                    updatedArray.push({ nome_jogador: jogador.nome_jogador, valor: event as number, jogador_id: jogador._id, jogo_id: jogador.jogo_id });
                }
                return updatedArray;
            });
        }
    };

    const handleAddDespesaCompartilhada = async (e: any) => {
        e.preventDefault();

        if (nomeJogadorDespesa != '' && nomeJogadorDespesa != undefined && valorDespesa > 0 && nomeDespesa != '') {

            const objDespesa = despesaCompartilhada.map(item => ({
                ...item,
                nome_despesa: "- " + nomeDespesa,
                categoria: "Despesas",
                valor: item.valor.toString() != '0' ? parseFloat(item.valor.toString().replaceAll(',', ';')) * -1 : 0
            }));

            // Create a new object for the despesa to be added
            const newDespesa = {
                nome_jogador: nomeJogadorDespesa,
                valor: parseFloat(valorDespesa.toString().replaceAll(',', '.')),
                nome_despesa: "+ " + nomeDespesa,
                categoria: "Despesas",
                jogador_id: idJogadorDespesa,
                jogo_id: jogoId,
            };

            objDespesa.push(newDespesa);

            const novaDespesaComp = await Financeiro_POST_despesaCompartilhada(objDespesa)

            if (novaDespesaComp.result == true) {
                notifySuccess("Despesa compartilhada adicionada!")
                triggerFetch((prev: any) => !prev);
            }

        }
        else {
            notifyError('Insira uma despesa, quem pagou e seu valor para continuar!')
        }
    }

    // ############
    // ############
    // RETURN
    // ############
    // ############

    if (jogadores.length <= 0) {
        return (
            <div>Sem jogadores disponíveis</div>
        )
    }

    else {
        return (
            <div>
                <TextInputM2 disabled={false} label='Nome da Despesa' name='despesa' onChange={(e: any) => setNomeDespesa(e.target.value)} value={nomeDespesa} />
                <SelectInputM2 label='Quem pagou' name='quem-pagou' onChange={handleSelectInput} value={nomeJogadorDespesa}
                    options={jogadores.map((player: any) => ({ value: player.nome_jogador, option: player._id as unknown as string }))} />
                <CurrencyInput value={valorDespesa} onValueChange={(e: any) => setValorDespesa(e)} intlConfig={{ locale: 'pt-BR', currency: 'BRL' }} className='my-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                <hr />
                <p className='mt-2 text-center'>Divisão por Jogador</p>
                <div className='overflow-x-auto text-center w-full'>
                    <table className='table-auto mx-auto'>
                        <thead>
                            <tr>
                                <th className='hidden'>_id</th>
                                <th className='p-1 text-center'>Nome</th>
                                <th className='p-1 text-center'>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jogadores.map((player: any, index: number) => (
                                <tr key={index}>
                                    <td className='hidden'>{player._id}</td>
                                    <td className='p-1 text-left'>{player.nome_jogador}</td>
                                    <td className='p-1 text-right'>
                                        <CurrencyInput value={despesaCompartilhada.find(item => item.nome_jogador === player.nome_jogador)?.valor || 0}
                                            onValueChange={(e: any) => handleChangeDes(e, player)}
                                            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                                            className='w-full p-1 text-right' />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='text-white font-bold w-full text-center'>
                    <button onClick={handleAddDespesaCompartilhada} type='submit' className='mt-3 rounded-md shadow-lg border bg-blue-500 px-2 py-3 '>Adicionar Despesa</button>
                </div>
            </div>
        )
    }
}

export default DespesaCompartilhada