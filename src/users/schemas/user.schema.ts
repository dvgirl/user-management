// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type UserDocument = User & Document;


@Schema({ timestamps: true })
export class User {
@Prop({ required: true })
name: string;


@Prop({ required: true, unique: true })
email: string;


@Prop({ required: true })
password: string; // hashed


@Prop({ default: false })
isAdmin: boolean;


@Prop({ default: false })
deleted: boolean;


@Prop({ default: null })
avatar?: string; // filename or path
}


export const UserSchema = SchemaFactory.createForClass(User);
// Exclude password when returning JSON
UserSchema.methods.toJSON = function () {
const obj = this.toObject();
delete obj.password;
return obj;
};