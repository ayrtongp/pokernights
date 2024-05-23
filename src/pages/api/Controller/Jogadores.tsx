import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/Database';
import { ObjectId } from 'mongodb'
import { getCurrentDateTime } from '@/utils/functions';

export default async function handler(req: NextApiRequest, res: NextApiResponse,) {

  const { db } = await connect();
  const mainCollection = db.collection('jogadores')

  switch (req.method) {
    case 'GET':

      // -------------------------
      // GET All 
      // -------------------------

      if (req.query.type === 'getAll') {
        try {
          const documents = await mainCollection.find().sort({ createdAt: 1 }).toArray();
          return res.status(200).json(documents);
        } catch (err) {
          console.error(err)
          return res.status(500).json({ message: 'getAll: Erro não identificado. Procure um administrador.' });
        }
      }

      // -------------------------
      // GET GAME 
      // -------------------------

      if (req.query.type === 'getGame') {
        try {
          const documents = await mainCollection.find({ jogo_id: req.query.jogo_id }).sort({ createdAt: 1 }).toArray();
          return res.status(200).json(documents);
        } catch (err) {
          console.error(err)
          return res.status(500).json({ message: 'getAll: Erro não identificado. Procure um administrador.' });
        }
      }

      // -------------------------
      // CONTAR DOCUMENTOS
      // -------------------------

      else if (req.query.type == 'countDocuments') {
        try {
          const totalDocuments = await mainCollection.countDocuments();
          return res.status(200).json({ count: totalDocuments });
        } catch (err) {

          return res.status(500).json({ message: 'countDocuments: Erro não identificado. Procure um administrador.' });
        }
      }

      else {
        return res.status(500).json({ message: 'GET Não encontrou nenhuma condição (IF)' });
      }

      break;

    case 'POST':

      // -------------------------
      // CRIAR NOVO 
      // -------------------------

      if (req.query.type == 'new') {
        try {
          const data = req.body
          const dataFields = {
            jogo_id: data['jogo_id'],
            nome_jogador: data['nome_jogador'],
            createdAt: getCurrentDateTime(),
            updatedAt: getCurrentDateTime(),
          }
          // Verifica se todos os campos necessários estão presentes no req.body
          const requiredFields = ['nome_jogador', 'jogo_id'];
          const missingFields = requiredFields.filter(field => !data[field]);
          const alreadyExists = await mainCollection.findOne({ jogo_id: dataFields['jogo_id'], nome_jogador: dataFields['nome_jogador'] })

          if (alreadyExists) {
            return res.status(400).json({ message: `Jogador já cadastrado: ${dataFields.nome_jogador} na data ${alreadyExists.createdAt}.`, method: 'POST', });
          }

          if (missingFields.length > 0) {
            return res.status(400).json({ error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}` });
          }
          else {
            const novoRegitro = await mainCollection.insertOne(dataFields);
            return res.status(201).json({ id: novoRegitro.insertedId, method: 'POST' });
          }
        } catch (err) {
          console.error(err)

          return res.status(500).json({ message: 'new: Erro não identificado. Procure um administrador.' });
        }
      }

      else {
        return res.status(400).json({ message: `Nenhum query.type indetificado`, method: 'POST', });
      }
      break;

    case 'PUT':
      try {
        const myObjectId = new ObjectId(req.query.id as unknown as ObjectId);
        const bodyObject = JSON.parse(req.body)

        if (req.query.type === 'changePhoto' && bodyObject.foto_base64) {
          const novaFoto = bodyObject.foto_base64
          await mainCollection.updateOne({ _id: myObjectId }, { $set: { foto_base64: novaFoto } },);
          return res.status(201).json({ message: 'Foto do usuário alterada com sucesso!', method: 'PUT', url: `ResidentesController?type=${req.query.tipo}&id=${req.query.id}` });
        }

        else if (req.query.type === 'changeData') {
          const myBody = JSON.parse(req.body)
          await mainCollection.updateOne({ _id: myObjectId }, { $set: myBody },);
          return res.status(201).json({ message: 'Dados do sinal vital alterados com sucesso!', method: 'PUT', url: `SinaisVitaisControllerid=${req.query.id}` });
        }

        else {
          return res.status(404).json({ message: 'Residente não encontrado!', });
        }

      } catch (err) {
        return res.status(500).json({ message: 'Erro não identificado. Procure um administrador.' });
      }
      break;

    case 'DELETE':

      if (req.query.type === 'deleteGame') {
        try {
          const jogoId = req.query.jogoId as string
          const result = await mainCollection.deleteMany({ jogo_id: jogoId });

          if (result.deletedCount === 0) {
            return res.status(202).json({ message: 'Nenhum valor deletado!', });
          }

          return res.status(201).json({ message: 'Jogadores deletado com sucesso', method: 'DELETE' });
        } catch (err) {

          return res.status(500).json({ message: 'Erro não identificado. Procure um administrador.' });
        }
      }

      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }


}