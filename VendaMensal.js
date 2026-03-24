import mongoose from "mongoose";

const VendaMensalSchema = new mongoose.Schema({

    data: Date,
    valor: Number
    
});

export default mongoose.model('VendaMensal', VendaMensalSchema);