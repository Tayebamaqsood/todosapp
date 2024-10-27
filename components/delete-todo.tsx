"use client"
import { Button } from "./ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import {mutate} from "swr";

export default function DeleteTodo({ id }: { id: string }) {
    const handleDelete = async () => {
        const response = await fetch(`/api/todos?id=${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            console.log("Todo is deleted");
            mutate("/api/todos");
        } else {
            console.error("Failed to delete todo");
        }
    };

    return (
        <Button
            onClick={handleDelete}
            variant="ghost"
            size="icon"
            className=" mr-1text-red-500 bg-red-100 hover:text-red-700 hover:bg-red"
        >
            <TrashIcon className="h-4 w-4" />
        </Button>
    );
}