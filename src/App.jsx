import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

// GraphQL Queries and Mutations
const GET_BOOKS = gql`
  query GetBooks {
    books {
      success
      message
      dataList {
        id
        title
        author
      }
    }
  }
`;

const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $author: String!) {
    createBook(input: {title: $title, author: $author}) {
      success
      message
      data {
        id
        title
        author
      }
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: Int!, $title: String!, $author: String!) {
    updateBook(id: $id, input: {title: $title, author: $author}) {
      success
      message
      data {
        id
        title
        author
      }
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(id: $id) {
      success
      message
    }
  }
`;

const App = () => {
  const { loading, error, data, refetch } = useQuery(GET_BOOKS);
  const [createBook] = useMutation(CREATE_BOOK, {
    onCompleted: () => refetch(),
  });
  const [updateBook] = useMutation(UPDATE_BOOK, {
    onCompleted: () => refetch(),
  });
  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: () => refetch(),
  });

  const [formData, setFormData] = useState({ id: null, title: "", author: "" });
  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, title, author } = formData;

    if (isEdit) {
      updateBook({ variables: { id: parseInt(id), title, author } });
    } else {
      createBook({ variables: { title, author } });
    }

    setFormData({ id: null, title: "", author: "" });
    setIsEdit(false);
  };

  const handleEdit = (book) => {
    setFormData({ id: book.id, title: book.title, author: book.author });
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    deleteBook({ variables: { id } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  const books = data.books.dataList;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Books</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        {isEdit && <input type="hidden" name="id" value={formData.id} />}
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Author"
          required
        />
        <button type="submit">{isEdit ? "Update" : "Create"}</button>
      </form>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author}{" "}
              <button onClick={() => handleEdit(book)}>Edit</button>
              <button onClick={() => handleDelete(book.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
