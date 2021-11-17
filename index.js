import mongoose from 'mongoose';
import express from 'express';

import Laptop from './dbModel.js'


//app config
const app = express()

//middlewares
app.use(express.json())
app.use((req,res,next) =>{
    res.setHeader('Access-Control-Allow-Origin','*'),
    res.setHeader('Access-Control-Allow-Headers','*'),
    next();
})

//db config
const connection_url = "mongodb+srv://dbCRUD:gedearyarp@crudtesting.q0h1s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//db connect
const connectToMongo = async () => {
  try {
    await mongoose.connect(connection_url, { useNewUrlParser: true });
    console.log('connected to MongoDB');
  } catch(error) {
    console.log('error connection to MongoDB:', error.message);
  }
};
connectToMongo();

app.get('/list_laptop', (req, res) => {
    Laptop.find()
      .exec()
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({error: err});
      })
})

app.post('/create_laptop', (req, res) => {
  const laptop = new Laptop({
    _id: new mongoose.Types.ObjectId(),
    name : req.body.name,
    RAM : req.body.RAM,
    price : req.body.price,
    processor : req.body.processor
  });
  laptop
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Berhasil menambahkan data',
        createdLaptop: laptop
      })
    })
    .catch(err => {
      res.status(500).send({error: err});
    });
})

app.get("/:laptopId", (req, res) => {
  const id = req.params.laptopId;
  Laptop.findById(id)
    .exec()
    .then(data => {
      data ? (
        res.status(200).send(data)
      ) : (
        res.status(404).send({ message: "ID tidak valid!" })
      )
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.patch("/:laptopId", (req, res) => {
  const id = req.params.laptopId;
  const filter = { _id: id };
  const update = {
    _id: id,
    name : req.body.name,
    RAM : req.body.RAM,
    price : req.body.price,
    processor : req.body.processor
  };
  Laptop.findOneAndUpdate(filter, update)
    .exec()
    .then(result => {
      res.status(200).send({
        message: "Berhasil memperbarui data",
        laptopBefore: result,
        laptopAfter: update
      });
    })
    .catch(err =>{
      res.status(500).send({
        error: err
      });
    })
});

app.delete("/:laptopId", (req, res, next) => {
  const id = req.params.laptopId;
  Laptop.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).send({
        message: "Berhasil menghapus data",
        result: result
      });
    })
    .catch(err => {
      res.status(500).send({
        error: err
      });
    });
});

app.listen(3000)