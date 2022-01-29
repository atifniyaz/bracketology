import * as mongo from "mongodb";
import { ObjectId } from "mongodb";
import path from "path";

import { User } from "./types";

class Database {
  client?: mongo.MongoClient;

  constructor() {
    const uri = `mongodb+srv://gh_codebases@cluster0.fqnlu.mongodb.net`;
    const tlsCAFile = String(path.join(__dirname, "../cert.pem"));

    this.client = new mongo.MongoClient(uri, {
      authMechanism: mongo.AuthMechanism.MONGODB_X509,
      tls: true,
      tlsCertificateKeyFile: tlsCAFile,
      retryWrites: true,
      w: "majority",
    });

    this.client
      .connect()
      .then(async () => {
        await this.client.db("admin").command({ ping: 1 });
        console.log("Mongo is ready to rumble!");
      })
      .catch((error) => {
        console.log("Failed to conncect to MongoDB!");
        console.log(error);
      });
  }

  public async create_user(user: User) {
    try {
      await this.get_user_collection().insertOne(user);
      return { success: true, ...user };
    } catch (error) {
      console.log(error);
      return { success: false, error: String(error) };
    }
  }

  public async find_user_by_email(email: string) {
    try {
      return await this.get_user_collection().findOne({ email });
    } catch (error) {
      console.log(error);
      return { success: false, error: String(error) };
    }
  }

  private get_user_collection() {
    return this.client.db("bracket_app").collection("users");
  }
}

export const database = new Database();
