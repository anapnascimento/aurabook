"use client";

import { Book } from "@/app/types/book";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import DeleteBookModal from "@/app/components/DeleteBookModal";
import { deleteBook } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

const statusLabels = {
  TO_READ: "Para Ler",
  READING: "Lendo",
  READ: "Lido",
  PAUSED: "Pausado",
  FINISHED: "Finalizado",
  ABANDONED: "Abandonado",
} as const;

const statusColors = {
  TO_READ: "bg-gray-400 text-white",
  READING: "bg-blue-600 text-white",
  READ: "bg-emerald-600 text-white",
  PAUSED: "bg-yellow-600 text-white",
  FINISHED: "bg-green-600 text-white",
  ABANDONED: "bg-red-600 text-white",
} as const;

interface BookCardProps {
  book: Book;
}

export function ClientBookCard({ book }: BookCardProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteBook(book.id.toString());
      setIsDeleteModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex gap-4">
            {/* Capa do livro */}
            {book.coverUrl && (
              <div className="hidden sm:block flex-shrink-0">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-24 h-36 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg line-clamp-2">
                  {book.title}
                </CardTitle>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[book.status]
                    }`}
                >
                  {statusLabels[book.status]}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">por {book.author}</p>

              {/* Gêneros logo abaixo do autor */}
              {book.genres && book.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {book.genres.slice(0, 3).map((genre) => (
                    <span
                      key={genre.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      {genre.title}
                    </span>
                  ))}
                  {book.genres.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs text-gray-500">
                      +{book.genres.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {book.totalPages && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Páginas:</span>{" "}
                  {book.totalPages}
                </p>
              )}
              {book.currentPage !== undefined && book.totalPages && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Progresso:</span>{" "}
                  {Math.round((book.currentPage / book.totalPages) * 100)}%
                </p>
              )}
              {book.rating && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-1">Avaliação:</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < book.rating! ? "text-yellow-400" : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sinopse resumida se disponível */}
            {book.synopsis && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {book.synopsis}
              </p>
            )}

            <div className="flex gap-2 pt-2 items-center">
              <Link href={`/books/${book.id}`} className="flex-1">
                <button className="w-full px-3 py-2 text-sm text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
                  Ver Detalhes
                </button>
              </Link>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors mb-2"
                title="Excluir livro"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash">
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <DeleteBookModal
        isOpen={isDeleteModalOpen}
        bookTitle={book.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
