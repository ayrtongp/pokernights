import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/Database';
import { ObjectId } from 'mongodb'
import { getCurrentDateTime } from '@/utils/functions';

export default async function handler(req: NextApiRequest, res: NextApiResponse,) {

  const { db } = await connect();
  const mainCollection = db.collection('jogos')

  switch (req.method) {
    case 'GET':

      // -------------------------
      // GET All 
      // -------------------------

      if (req.query.type === 'getAll') {
        try {
          const documents = await mainCollection.find().sort({ createdAt: -1 }).toArray();
          return res.status(200).json(documents);
        } catch (err) {
          console.error(err)
          return res.status(500).json({ message: 'getAll: Erro não identificado. Procure um administrador.' });
        }
      }

      else if (req.query.type === 'isGameActive') {
        const id = new ObjectId(req.query.id as string)
        try {
          const documents = await mainCollection.findOne({ _id: id });
          return res.status(200).json(documents);
        } catch (err) {
          console.error(err)
          return res.status(500).json({ message: 'isGameActive: Erro não identificado. Procure um administrador.' });
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
            aberto: 'S',
            createdAt: getCurrentDateTime(),
            updatedAt: getCurrentDateTime(),
          }
          // Verifica se todos os campos necessários estão presentes no req.body
          // const requiredFields = ['insumo_id', 'quantidade', 'residente_id'];
          // const missingFields = requiredFields.filter(field => !data[field]);

          // if (missingFields.length > 0) {
          // return res.status(400).json({ error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}` });
          // }
          // else {
          const novoRegitro = await mainCollection.insertOne(dataFields);
          return res.status(201).json({ id: novoRegitro.insertedId, method: 'POST' });
          // }
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

      if (req.query.type === 'closeGame') {
        try {
          const { jogoId, aberto } = req.body
          const now = getCurrentDateTime();
          const putObj = { aberto, updatedAt: now }
          const id = new ObjectId(jogoId as string)

          const response = await mainCollection.updateOne({ _id: id }, { $set: putObj })
          return res.status(200).json({ response })

        } catch (error) {
          return res.status(500).json({ message: 'Erro não identificado. Procure um administrador.' });
        }
      }

      break;

    case 'DELETE':
      if (req.query.type === 'deleteGame') {
        try {
          const myObjectId = new ObjectId(req.query.jogoId as unknown as ObjectId);
          const result = await mainCollection.deleteOne({ _id: myObjectId });

          if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Jogo não encontrado!', });
          }

          return res.status(201).json({ message: 'Jogo deletado com sucesso', method: 'DELETE' });
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