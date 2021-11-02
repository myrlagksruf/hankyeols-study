import { ObjectId } from 'mongodb';
export interface iBookLoan{
    _id:ObjectId;
    title:string;
    author:string;
    year_written:number;
    edition:string;
    price:number;
};