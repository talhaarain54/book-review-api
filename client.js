const axios = require('axios');
const API = process.env.API_URL || 'http://localhost:3000';

const USERNAME = "testuser";
const PASSWORD = "testpass";
let TOKEN = "";

// Task 10: Get all books — async callback
function getAllBooksCallback(callback) {
  axios.get(`${API}/books`)
    .then(response => callback(null, response.data))
    .catch(err => callback(err));
}

// Task 11: Get book by ISBN — Promise
function getBookByISBNPromise(isbn) {
  return axios.get(`${API}/books/isbn/${isbn}`)
    .then(res => res.data);
}

// Task 12: Get books by author — async/await
async function getBooksByAuthor(author) {
  const res = await axios.get(`${API}/books/author/${encodeURIComponent(author)}`);
  return res.data;
}

// Task 13: Get books by title — async/await
async function getBooksByTitle(title) {
  const res = await axios.get(`${API}/books/title/${encodeURIComponent(title)}`);
  return res.data;
}

// Task 6: Register user
async function registerUser() {
  try {
    const res = await axios.post(`${API}/register`, { username: USERNAME, password: PASSWORD });
    console.log("--- Task 6: Register ---");
    console.log(res.data);
  } catch (e) {
    console.log("--- Task 6: Register ---");
    console.log(e.response ? e.response.data : e.message);
  }
}

// Task 7: Login user
async function loginUser() {
  try {
    const res = await axios.post(`${API}/login`, { username: USERNAME, password: PASSWORD });
    TOKEN = res.data.token;
    console.log("--- Task 7: Login ---");
    console.log(res.data);
  } catch (e) {
    console.log("--- Task 7: Login ---");
    console.log(e.response ? e.response.data : e.message);
  }
}

// Task 8: Add/modify review
async function addReview(isbn, review) {
  try {
    const res = await axios.put(`${API}/books/review/${isbn}`, { review }, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log("--- Task 8: Add/Modify Review ---");
    console.log(res.data);
  } catch (e) {
    console.log("--- Task 8: Add/Modify Review ---");
    console.log(e.response ? e.response.data : e.message);
  }
}

// Task 9: Delete review
async function deleteReview(isbn) {
  try {
    const res = await axios.delete(`${API}/books/review/${isbn}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log("--- Task 9: Delete Review ---");
    console.log(res.data);
  } catch (e) {
    console.log("--- Task 9: Delete Review ---");
    console.log(e.response ? e.response.data : e.message);
  }
}

// Task 5: Get book review
async function getBookReview(isbn) {
  try {
    const res = await axios.get(`${API}/books/review/${isbn}`);
    console.log("--- Task 5: Get Book Review ---");
    console.log(res.data);
  } catch (e) {
    console.log("--- Task 5: Get Book Review ---");
    console.log(e.response ? e.response.data : e.message);
  }
}

// Task 1–4: Public API requests
async function publicRequests() {
  try {
    const allBooks = await axios.get(`${API}/books`);
    console.log("--- Task 1: Get All Books ---");
    console.log(allBooks.data);

    const isbnBook = await axios.get(`${API}/books/isbn/9780143126560`);
    console.log("--- Task 2: Get Book By ISBN ---");
    console.log(isbnBook.data);

    const authorBooks = await axios.get(`${API}/books/author/Paulo Coelho`);
    console.log("--- Task 3: Get Books By Author ---");
    console.log(authorBooks.data);

    const titleBooks = await axios.get(`${API}/books/title/Sapiens`);
    console.log("--- Task 4: Get Books By Title ---");
    console.log(titleBooks.data);
  } catch (e) {
    console.log("Error in publicRequests:", e.response ? e.response.data : e.message);
  }
}

// Task 10–13 demo
async function asyncDemo() {
  console.log("--- Task 10: Get All Books (Callback) ---");
  getAllBooksCallback((err, books) => {
    if (err) return console.error('Callback error:', err.message || err);
    console.log(books);
  });

  console.log("--- Task 11: Get Book By ISBN (Promise) ---");
  getBookByISBNPromise('9780143126560')
    .then(book => console.log(book))
    .catch(err => console.error(err.response ? err.response.data : err.message));

  console.log("--- Task 12: Get Books By Author (Async/Await) ---");
  const byAuthor = await getBooksByAuthor('Paulo Coelho');
  console.log(byAuthor);

  console.log("--- Task 13: Get Books By Title (Async/Await) ---");
  const byTitle = await getBooksByTitle('Sapiens');
  console.log(byTitle);
}

// Run all tasks sequentially
(async () => {
  await publicRequests();      // Tasks 1–4
  await getBookReview('9780143126560'); // Task 5
  await registerUser();        // Task 6
  await loginUser();           // Task 7
  await addReview('9780143126560', 'Amazing book!'); // Task 8
  await deleteReview('9780143126560');              // Task 9
  await asyncDemo();           // Tasks 10–13
})();
