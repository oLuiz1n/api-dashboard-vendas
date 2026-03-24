import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import VendaMensal from "./VendaMensal.js"; 

dotenv.config();


const app = express();
const PORT = 3000;

// middleware - Uma função que trata as informaçãoes recebidas

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.log(' Deu erro ao conectar ao MongoDB', error);
  }  
};

connectDB();

//CRUD

// CREATE
// app.post('/vendas', async (req, res) => {
//   try {
//      const { data, valor } = req.body;
//
//     const novaVendaMensal = await VendaMensal.create({data,valor});
//     res.json(novaVendaMensal);
//   } catch (error) {
//     res.json({ error: error })
//   }
// });
app.post('/vendas', async (req, res) => {
  try {
    const { data, valor } = req.body;

    if (!data || !valor) {
      return res.status(400).json({ error: "Data e valor são obrigatórios" });
    }

    const novaVendaMensal = await VendaMensal.create({ data, valor });

    res.json(novaVendaMensal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// READ
// app.get('/vendas', async (req, res) => {
//   try {
//     const vendasMensais = await VendaMensal.find()
//     res.json(vendasMensais);
//   } catch (error) {
//     res.json({ error: error })
//   }
// });
app.get('/vendas', async (req, res) => {
  try {
    let { mes, ano } = req.query;

    mes = mes ? Number(mes) : null;
    ano = ano ? Number(ano) : null;

    const vendas = await VendaMensal.find();

    const filtradas = vendas.filter(v => {
      const data = new Date(v.data);

      const mesVenda = data.getMonth() + 1;
      const anoVenda = data.getFullYear();

      return (
        (!mes || mesVenda === mes) &&
        (!ano || anoVenda === ano)
      );
    });

    res.json(filtradas);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
// app.put('/vendas/:id', async (req, res) => {
//   try {
//     const novaVendaMensal = await VendaMensal.findByIdAndUpdate(
//       req.params.id, 
//       req.body,
//       { new: true }
//     );
//     res.json(novaVendaMensal);
//   } catch (error) {
//     res.json({ error: error })
//   }
// }); 
app.put('/vendas/:id', async (req, res) => {
  try {

    if (!req.body.data || !req.body.valor) {
      return res.status(400).json({ error: "Data e valor são obrigatórios" });
    }

    const vendaAtualizada = await VendaMensal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(vendaAtualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
app.delete('/vendas/:id', async (req, res) => {
  try {
    const vendaMensalExcluida = await VendaMensal.findByIdAndDelete(
      req.params.id
    );
    res.json(vendaMensalExcluida);
  } catch (error) {
    res.json({ error: error })
  }
}); 

app.listen(3000, () => console.log(`O servidor esta rodando na porta ${PORT}`));

