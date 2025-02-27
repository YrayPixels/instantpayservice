"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const openAiTTS = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    // const speechFile = path.resolve("./speech.mp3");
    const mp3 = yield openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: text,
    });
    const buffer = Buffer.from(yield mp3.arrayBuffer());
    // await fs.promises.writeFile(speechFile, buffer);
    return buffer;
});
exports.default = openAiTTS;
