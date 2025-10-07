"use client";

import { useState, useCallback, useEffect } from "react";
import { useBooks } from "../contexts/BookContext";
import { Suspense } from "react";
import BooksPage from "./books/page";

export default function Home() {
  const { books, isLoading, error, refreshBooks } = useBooks();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const searchParams = { q: "" };


  const handleRefresh = useCallback(async () => {
    await refreshBooks();
    setLastUpdate(new Date());
  }, [refreshBooks]);

  useEffect(() => {
    if (!isLoading && books.length > 0) {
      setLastUpdate(new Date());
    }
  }, [isLoading, books]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Erro</h2>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: books.length,
    reading: books.filter((book) => book.status === "READING").length,
    finished: books.filter((book) => book.status === "FINISHED").length,
    read: books.filter((book) => book.status === "READ").length,
    toRead: books.filter((book) => book.status === "TO_READ").length,
    paused: books.filter((book) => book.status === "PAUSED").length,
    abandoned: books.filter((book) => book.status === "ABANDONED").length,
  };

  return (
    <div className="space-y-6">
      <div className="pb-1">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          {/* 
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1 text-purple-600 rounded-md hover:bg-blue-50 transition-colors"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${isLoading ? "animate-spin" : ""}`}
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
            </svg>
            {isLoading ? "Atualizando..." : "Atualizar"}
          </button>
          */}
        </div>
        
        <p className="text-xs text-gray-500">
          Última atualização: {lastUpdate.toLocaleTimeString()}
        </p>
        
      </div>

      <div className="flex gap-2 justify-start flex-wrap border-b pb-3">
        {[
          { label: "Total de Livros", value: stats.total, color: "bg-gray-600" },
          { label: "Lendo", value: stats.reading, color: "bg-blue-600" },
          { label: "Para Ler", value: stats.toRead, color: "bg-gray-400" },
          { label: "Lidos", value: stats.read, color: "bg-emerald-600" },
          { label: "Finalizados", value: stats.finished, color: "bg-green-600" },
          { label: "Pausados", value: stats.paused, color: "bg-yellow-600" },
          { label: "Abandonados", value: stats.abandoned, color: "bg-red-600" },
        ].map((stat, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 px-3 py-1 rounded-full ${stat.color} text-white text-xs mb-2`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>{stat.label}: {isLoading ? "..." : stat.value}</span>
          </div>
        ))}
      </div>

      {/* Renderizando a página de livros*/}
      <Suspense fallback={<div>Carregando...</div>}>
        <BooksPage searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
