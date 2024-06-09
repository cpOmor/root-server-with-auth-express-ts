import mongoose from "mongoose";
import config from ".";

export async function databaseConnecting() {
    try {
      if (config.mongo_prod as object | undefined) {
        await mongoose.connect(config.mongo_uri_prod as string);
        console.log('Database      :🚀 Connected to database (Production)');
      } else {
        await mongoose.connect(config.mongo_uri_dev as string);
        console.log('Database      :🚀 Connected to database (Development)');
      }
    } catch (error) {
      console.error('Database      :🙄 Error connecting to the database');
    }
  }