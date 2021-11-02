import { MongoClient } from "mongodb";
import { iBookLoan } from "./type";
import { url } from './data';

const client = new MongoClient(url);

const init = async () => {
    await client.connect();
    const db = client.db('bookLoan');
    const col = db.collection('bookCategory');
    const result = await col.findOne({title:'Northanger Abbey'}) as iBookLoan;
};

init();