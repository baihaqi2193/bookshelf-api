const { nanoid } = require('nanoid');
const books = require('./books');

const getAllBooks = (req, h) => {
  const { name = '', reading, finished } = req.query;

  const bools = [false, true];

  const res = h
    .response({
      status: 'success',
      message: 'successfully retrieved books from bookshelf',
      data: {
        books: books
          .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
          .filter((book) => (finished === undefined
            ? book
            : parseInt(finished) === 0 || parseInt(finished) === 1
              ? book.finished === bools[parseInt(finished)]
              : book))
          .filter((book) => (reading === undefined
            ? book
            : parseInt(reading) === 0 || parseInt(reading, 10) === 1
              ? book.reading === bools[parseInt(reading, 10)]
              : book)),
      },
    })
    .code(200);

  return res;
};

const addBook = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  books.push({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  });

  if (!name) {
    const res = h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return res;
  }

  const res = h
    .response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
    .code(201);

  return res;
};

const getBookById = (req, h) => {
  const { id } = req.params;

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex !== -1) {
    const book = books[bookIndex];
    const res = h
      .response({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);

    return res;
  }

  const res = h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
  return res;
};

const editBookById = (req, h) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex !== -1) {
    const updatedAt = new Date().toISOString();

    if (!name) {
      const res = h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);

      return res;
    }

    if (readPage > pageCount) {
      const res = h
        .response({
          status: 'fail',
          message:
            'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);

      return res;
    }

    const finished = pageCount === readPage;

    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished,
    };

    const res = h
      .response({ status: 'success', message: 'Buku berhasil diperbarui' })
      .code(200);

    return res;
  }

  const res = h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);

  return res;
};

const deleteBookById = (req, h) => {
  const { id } = req.params;

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);

    const res = h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);

    return res;
  }

  const res = h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);

  return res;
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
