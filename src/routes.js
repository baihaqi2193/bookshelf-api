const {
  getAllBooks,
  addBook,
  getBookById,
  editBookById,
  deleteBookById,
} = require('./handler');

const routes = [
  {
    path: '/books',
    method: 'GET',
    handler: getAllBooks,
  },
  {
    path: '/books',
    method: 'POST',
    handler: addBook,
  },
  {
    path: '/books/{id}',
    method: 'GET',
    handler: getBookById,
  },
  {
    path: '/books/{id}',
    method: 'PUT',
    handler: editBookById,
  },
  {
    path: '/books/{id}',
    method: 'DELETE',
    handler: deleteBookById,
  },
];

module.exports = routes;
