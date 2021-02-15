import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const UserSchema = new Schema({
    username  : { type : String, required : true },
    password: { type : String, required : true},
    scores : { type : Number, required: false, default : 0 }
}, {timestamps:true});
  
export default model('user',UserSchema);