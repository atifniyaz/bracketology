import * as mongo from "mongodb";
import { ObjectId } from "mongodb";
import path from "path";

import { User } from "./types";

class Database {
  client?: mongo.MongoClient;

  constructor() {
    const uri = process.env["MONGODB_URI"];
    const tlsCAFile = path.join(__dirname, "../cert.pem");

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

  public async create_bracket(token: string, selections: any) {
    try {
      await this.get_bracket_collection().deleteMany({ token });
      await this.get_bracket_collection().insertOne({
        token,
        selections,
      });
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, error: String(error) };
    }
  }

  public async find_user_by_email(email: string) {
    try {
      const user = await this.get_user_collection().findOne({ email });
      return {
        success: user !== null,
        response: user,
      };
    } catch (error) {
      console.log(error);
      return { success: false, error: String(error) };
    }
  }

  public async find_bracket_by_token(token: string) {
    try {
      const response = await this.get_bracket_collection().findOne({
        token,
      });
      return {
        success: response !== null,
        response: response as any,
      };
    } catch (error) {
      console.log(error);
      return { success: false, error: String(error) };
    }
  }

  public async get_master_bracket() {
    try {
      const response = await this.client
        .db("bracket_app")
        .collection("brackets")
        .findOne({ token: "master" });
      return {
        success: response !== null,
        response: response as any,
      };
    } catch (error) {
      console.log(error);
      return { success: false, error: String(error) };
    }
  }

  public async get_brackets() {
    try {
      const response = await this.client
        .db("bracket_app")
        .collection("brackets")
        .find()
        .toArray();
      return {
        success: response !== null,
        response: response as any,
      };
    } catch (error) {
      console.log(error);
      return { success: false, error: String(error) };
    }
  }

  public get_teams_collection() {
    return this.client.db("bracket_app").collection("teams");
  }

  private get_user_collection() {
    return this.client.db("bracket_app").collection("users");
  }

  public get_bracket_collection() {
    return this.client.db("bracket_app").collection("brackets");
  }
}

export const database = new Database();
