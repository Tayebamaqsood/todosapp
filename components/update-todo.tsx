"use client";
import { useState } from "react";
import { mutate } from "swr";
import { Button } from "./ui/button";
import
{
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";
import TodoForm from "./todo-form";
import { type TodoSchema } from "@/lib/zod";
import { Todo } from "@prisma/client";
import { Pencil1Icon } from "@radix-ui/react-icons";

export default function UpdateTodo({ todo }: { todo: Todo }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const onSubmit = async (data: TodoSchema) => {
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const response = await fetch("/api/todos", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, id: todo.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || "Failed to update todo");
            }

            setDialogOpen(false);
            mutate("/api/todos");
        } catch (error) {
            console.error("Error occurred:", error);
            setErrorMessage(error instanceof Error ? error.message : "Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="mr-1 text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-blue-200"
                >
                    <Pencil1Icon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Todo</DialogTitle>
                </DialogHeader>
                <TodoForm  
        defaultValues={{
            title:"",
            description:"",
            isCompleted:false,
        }}
        onSubmit={onSubmit}
        submitButtonText="Create"
        isSubmitting = {isSubmitting}
        />
            </DialogContent>
        </Dialog>
    );
}