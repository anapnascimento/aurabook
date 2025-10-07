"use client";

import { useState, useEffect } from "react";
import { getBooks } from "@/app/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import BookSearch from "@/components/BookSearch";
import { ClientBookCard } from "@/components/BookCard";
import type { Book } from "@/app/types/book";

export default function BooksPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Carrega os livros quando o componente for montado
  useEffect(() => {
    const fetchBooks = async () => {
      const booksData = await getBooks();
      setBooks(booksData);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const query = searchParams.q ?? "";

  // Filtra os livros com base no parâmetro de pesquisa
  const filteredBooks = books.filter((book: Book) => {
    if (!query) return true;
    const searchTerms = query.toLowerCase().split(" ");
    return searchTerms.every(
      (term) =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        (book.genres &&
          book.genres.some((genre) =>
            genre.title.toLowerCase().includes(term)
          )) ||
        (book.synopsis && book.synopsis.toLowerCase().includes(term))
    );
  });

  // Exibe um carregamento enquanto os livros estão sendo obtidos
  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meus Livros</h1>
        <Link
          href="/books/add"
          className="px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-700"
        >
          Adicionar Livro
        </Link>
      </div>

      {/* Card de Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Livros</CardTitle>
        </CardHeader>
        <CardContent>
          <BookSearch />
        </CardContent>
      </Card>

      {/* Listagem de Livros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book: Book) => (
          <ClientBookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Caso não haja livros */}
      {books.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhum livro encontrado</p>
          <Link
            href="/books/add"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Adicionar um livro
          </Link>
        </div>
      )}

      {/* Caso a pesquisa não encontre nenhum livro */}
      {books.length > 0 && filteredBooks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Nenhum livro encontrado para &quot;{query}&quot;
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Tente pesquisar novamente, por outro título, autor ou gênero
          </p>
        </div>
      )}
    </div>
  );
}