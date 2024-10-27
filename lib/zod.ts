import {z} from "zod";
export const todoSchema = z.object({
    title:z.string().min(1, "Title is requuired").max(100, "Title must be 100 character"),
    description :z.string ().max(500, "Description must be 500 characters").optional(),
    isCompleted:z.boolean().default(true),
});
export type TodoSchema =z.infer< typeof todoSchema>;