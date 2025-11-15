const axios = require('axios');
const API = process.env.API_URL || 'http://localhost:3000';

function getAllBooksCallback(callback) {
  axios.get(`${API}/books`)
    .then(response => callback(null, response.data))
    .catch(err => callback(err));
}

function getBookByISBNPromise(isbn) {
  return axios.get(`${API}/books/isbn/${isbn}`)
    .then(res => res.data);
}

async function getBooksByAuthor(author) {
  const res = await axios.get(`${API}/books/author/${encodeURIComponent(author)}`);
  return res.data;
}

async function getBooksByTitle(title) {
  const res = await axios.get(`${API}/books/title/${encodeURIComponent(title)}`);
  return res.data;
}

async function demo() {
  console.log('--- Task 10 (callback) ---');
  getAllBooksCallback((err, books) => {
    if (err) return console.error('Callback error:', err.message || err);
    console.log('Books (callback):', books);

    console.log('\n--- Task 11 (Promise) ---');
    getBookByISBNPromise('9780143126560')
      .then(book => {
        console.log('Book (promise):', book);
      })
      .catch(err => console.error('Promise error:', err.response ? err.response.data : err.message));

    (async () => {
      console.log('\n--- Task 12 (async/await by author) ---');
      try {
        const byAuthor = await getBooksByAuthor('Paulo Coelho');
        console.log('Books by author:', byAuthor);
      } catch (e) {
        console.error('Author search error:', e.response ? e.response.data : e.message);
      }

      console.log('\n--- Task 13 (async/await by title) ---');
      try {
        const byTitle = await getBooksByTitle('Sapiens');
        console.log('Books by title:', byTitle);
      } catch (e) {
        console.error('Title search error:', e.response ? e.response.data : e.message);
      }
    })();
  });
}

if (require.main === module) demo();
