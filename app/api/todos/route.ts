import prisma from "@/lib/prisma";
import { todoSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import { Todo } from "@prisma/client";

export async function GET() {
    try {
      const todos = await prisma.todo.findMany({
      orderBy:{
        createdAt:'desc'
      },
      }) ;
      return NextResponse.json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
    }
  }
  export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = todoSchema.safeParse(body);

        // Check if the validation failed
        if (!result.success) {
            return NextResponse.json(
                {
                    message: 'Invalid input',
                    errors: result.error.errors, // Provide detailed error messages
                },
                { status: 400 }
            );
        }

        const todoData = result.data;

        // Create a new todo in the database
        const newTodo = await prisma.todo.create({
            data: {
                title: todoData.title,
                description: todoData.description || '',
                isCompleted: todoData.isCompleted || false, // Default to false if not provided
            },
        });

        return NextResponse.json(newTodo, { status: 201 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
export async function DELETE(request:NextRequest){
    try{
        const id = request.nextUrl.searchParams.get('id');
        if(!id){
            return NextResponse.json({message:'Todo is required'} , {status :400});
        }
        const deleteTodo= await prisma.todo.delete({
            where:{id} ,
        });
        if(!deleteTodo){
            return NextResponse.json({message:'Todo not found'} , {status :404});
        }
        return NextResponse.json({message:'Todo is added sucessfuky'} , {status :200});
    }
    catch(error){
        console.error('error dlt todo', error);
        return NextResponse.json({message:'An unexpected error'} , {status :500});
    };
}
        export async function PUT(request:NextRequest){
            try{
            const body = await request.json();
            const{id ,...rest} = body;
            const result =todoSchema.safeParse(rest);
            if(!result.success){
                return NextResponse.json({message:'Invalid Input', errors:result.error.errors} , {status :400});
            }
            const todoData =result.data as Todo;
            if(!id){
                return NextResponse.json({message:'Todo is required'}, {status:400});
            }
            const updatedTodo= await prisma.todo.update({
                where:{id} ,
                data:{
                    title:todoData.title,
                    description:todoData.description,
                    isCompleted:todoData.isCompleted,
                },
            });
            if(!updatedTodo){
                return NextResponse.json({message:'Todo not found'} , {status :404});
            }
            return NextResponse.json(updatedTodo , {status :200});
        
        }
        catch(error){
            console.error('error updating todo', error);
            return NextResponse.json({message:'An unexpected error'} , {status :500});
        }
        }

