"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const mongo = __importStar(require("mongodb"));
const path_1 = __importDefault(require("path"));
class Database {
    constructor() {
        const uri = `mongodb+srv://cluster0.fqnlu.mongodb.net/`;
        const tlsCAFile = String(path_1.default.join(__dirname, "../cert.pem"));
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
    async create_user(user) {
        try {
            await this.get_user_collection().insertOne(user);
            return Object.assign({ success: true }, user);
        }
        catch (error) {
            console.log(error);
            return { success: false, error: String(error) };
        }
    }
    async find_user_by_email(email) {
        try {
            return await this.get_user_collection().findOne({ email });
        }
        catch (error) {
            console.log(error);
            return { success: false, error: String(error) };
        }
    }
    get_user_collection() {
        return this.client.db("bracket_app").collection("users");
    }
}
exports.database = new Database();
//# sourceMappingURL=database.js.map