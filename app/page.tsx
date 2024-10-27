"use client"
import TodoList from "@/components/todo-list";
import { Button } from "@/components/ui/button";
import CreateTodo from "@/components/create-todo";
export default function Home() {
  return (
    <div className="max-w-7xl flex flex-col gap-10 mx-auto p-10">
      <div className="flex justify-between item-center">
      <h1 className="text-4xl font bold">Todos</h1>
      <CreateTodo/>
    </div>
    <TodoList/>
    </div>
    
  );
}
