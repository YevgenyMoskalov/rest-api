import { Schema, model } from 'mongoose';

const UserSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  idType: {
    type: String,
    required: true,
    enum: ['Email', 'Phone'],
  },
}, {
  versionKey: false,
  timestamps: true,
  collection: 'users',
});

const User = model('User', UserSchema);

export default User;
