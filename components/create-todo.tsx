"use client"
import {Button} from "@/components/ui/button";
import
{
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";

import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import { title } from "process";
import { todoSchema , type TodoSchema  } from "@/lib/zod";
import { useState } from "react";
import useSWR, { mutate } from 'swr';
import TodoForm from "./todo-form";
export default function CreateTodo(){
    const[isSubmitting , setIsSubmitting ] = useState(false);
    const [errorMessage , SetErrorMessgae] =useState("");
    const [ isDialogOpen, setDialogOpen] = useState(false);
    const form = useForm <TodoSchema>({
        resolver:zodResolver(todoSchema),
        defaultValues:{
            title: "",
            description : "",
            isCompleted : false,

        },
    });

     const onSubmit =async(data:TodoSchema)=>{
        setIsSubmitting(true);
        
    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || "Failed to create todo");
        }

        form.reset();
        setDialogOpen(false);
        mutate("/api/todos");
        SetErrorMessgae("");
 
    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        setIsSubmitting(false); // Always reset submitting state
    }
};
    return(
        <Dialog open= {isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add todo</Button>
      </DialogTrigger>
      <DialogContent className=" sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create a new todo</DialogTitle>
        </DialogHeader>
        {errorMessage && (
            <div className="text-red-500 text-sm mb-4">
                {errorMessage}
            </div>
        )}
       
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
    )}