"use client";

import { Book } from "@/app/types/book";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteBookModal from "@/app/components/DeleteBookModal";
import { deleteBook } from "@/app/lib/actions";

interface ClientBookControlsProps {
  book: Book;
}

export function ClientBookControls({ book }: ClientBookControlsProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteBook(book.id.toString());
      router.push("/books");
      router.refresh();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/books")}
          className="flex items-center gap-2 px-3 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-600 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-undo-dot-icon lucide-undo-dot"
          >
            <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
            <path d="M3 7v6h6" />
            <circle cx="12" cy="17" r="1" />
          </svg>
          Voltar
        </button>

        <div className="flex gap-2">
          <Link href={`/books/${book.id}/edit`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              <svg xmlns="http://www.w3.org/2000/svg"
                width="24" height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-pen-line-icon lucide-pen-line">
                <path d="M13 21h8" />
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              </svg>
              Editar
            </button>

          </Link>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trash-icon lucide-trash"
            >
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Excluir
          </button>

        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <DeleteBookModal
        isOpen={isDeleteModalOpen}
        bookTitle={book.title}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
