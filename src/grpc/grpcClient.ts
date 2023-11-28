import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";

const protoFilePath = path.resolve(__dirname, "../proto/question.proto");
const packageDefinition = loadSync(protoFilePath);
const proto = loadPackageDefinition(packageDefinition);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const client = new (proto as any).proto.QuestionService(
  "localhost:50051",
  credentials.createInsecure()
);

export interface Question {
  id: string;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
}

function getRandomQuestions(): Promise<Question[]> {
  return new Promise<Question[]>((resolve, reject) => {
    client.GetRandomQuestions(
      {},
      (
        err: Error | null,
        response: {
          questions: Question[];
        }
      ) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.questions);
        }
      }
    );
  });
}

export { getRandomQuestions };
