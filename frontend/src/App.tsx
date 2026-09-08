import { useEffect, useState } from "react";
import "./App.css";

interface Book {
  id: number;
  title: string;
  author: string;
}

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://localhost:5000/books")

      .then((response) => response.json())

      .then((data) => setBooks(data));
    }
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return (
      <div className="books-container">
        <h1>Book Management System</h1>
        <h2>Books</h2>

        <button
          style={{ marginBottom: "20px" }}
          onClick={() => {
            setIsLoggedIn(false);
          }}
        >
          Logout
        </button>
        <form

          onSubmit={(event) => {

            event.preventDefault();

            if (title.trim() === "" || author.trim() === "") {
              alert("Please enter both title and author.");
              return; 
            }

            if (editingId === null) {

              fetch("http://localhost:5000/books", {

                method: "POST",

                headers: {

                  "Content-Type": "application/json",

                },

                body: JSON.stringify({

                  title: title,

                  author: author,

                }),

              })

                .then((response) => response.json())

                .then((data) => {

                  console.log(data);

                  setTitle("");

                  setAuthor("");

                  fetch("http://localhost:5000/books")

                    .then((response) => response.json())

                    .then((data) => setBooks(data));

                });

            } else {

              fetch(`http://localhost:5000/books/${editingId}`, {

                method: "PUT",

                headers: {

                  "Content-Type": "application/json",

                },

                body: JSON.stringify({

                  title: title,

                  author: author,

                }),

              })

                .then((response) => response.json())

                .then((data) => {

                  console.log(data);

                  setTitle("");

                  setAuthor("");

                  setEditingId(null);

                  fetch("http://localhost:5000/books")

                    .then((response) => response.json())

                    .then((data) => setBooks(data));
                            });
                        }
                      }}
        >

          <input

            type="text"

            placeholder="Book title"

            value={title}

            onChange={(event) => setTitle(event.target.value)}

          />

          <input

            type="text"

            placeholder="Author name"

            value={author}

            onChange={(event) => setAuthor(event.target.value)}

          />

          <button type="submit">
            {editingId === null ? "Add Book" : "Update Book"}
          </button>
        </form>

        <table>

          <thead>

            <tr>

              <th>ID</th>

              <th>Title</th>

              <th>Author</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {books.map((book) => (

              <tr key={book.id}>

                <td>{book.id}</td>

                <td>{book.title}</td>

                <td>{book.author}</td>
 
                <td>
                  <button
                      onClick={() => {

                        setEditingId(book.id);

                        setTitle(book.title);

                        setAuthor(book.author);

                       }}

                  >
                    Edit
                  </button> 
                  <button
                    onClick={() => {

                      fetch(`http://localhost:5000/books/${book.id}`, {

                        method: "DELETE",

                      })

                        .then((response) => response.json())

                        .then((data) => {

                          console.log(data);

                          fetch("http://localhost:5000/books")

                            .then((response) => response.json())

                            .then((data) => setBooks(data));

                        });

                    }}

                  >

                    Delete

                  </button> 
                 
                </td>

              </tr>

           ))}

          </tbody>

        </table>

      </div>

    );
  }
  return (

    <div className="login-container">

      <h1>Book Management System</h1>

      <h2>{isRegistering ? "Create Account" : "Login"}</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          fetch(
            isRegistering
              ? "http://localhost:5000/register"
              : "http://localhost:5000/login", 
            {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);

              if (isRegistering) {
                if (data.message === "User registered successfully") {
                  alert("Registration successful! Please login.");
                  setIsRegistering(false);
                  setEmail("");
                  setPassword("");
                } else {
                  alert(data.error);
                }
              } else {
                if (data.message === "Login successful") {
                  setIsLoggedIn(true);
                } else {
                  alert(data.error);
                }
              }
            });
          }}
         >

        <label>Email</label>

        <input 
          type="email" 
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)} 
        />

        <label>Password</label>

        <input 
          type="password" 
          placeholder="Enter your password" 
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit"> 
          {isRegistering ? "Register" : "Login"}
        </button>
         
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
        > 
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register" }
        </button>

      </form>

    </div>

  );

}

export default App;