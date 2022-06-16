const storageKey = "STORAGE_KEY";
const form = document.getElementById('insertNewBook');
const completedBooks = document.getElementById('completedBooks');
const uncompletedBooks = document.getElementById('uncompletedBooks');
const RENDER_EVENT = 'render-bookshelf';
const searchBookForm = document.getElementById('searchBooks');

const completedBooksContainer = completedBooks.childNodes[5];
const uncompletedBooksContainer = uncompletedBooks.childNodes[5];

function checkForStorage() {
    return typeof Storage !== 'undefined';
}

window.addEventListener('load', function() {
    if (checkForStorage()) {
      if (localStorage.getItem(storageKey) !== null) {
        window.dispatchEvent(new Event(RENDER_EVENT));
      } else {
          localStorage.setItem(storageKey, '[]');
      }
    } else {
      alert("Your browser does not support web storage");
    }
});

window.addEventListener(RENDER_EVENT, renderBookshelf);

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const id = +new Date();
    const bookTitle = document.getElementById('bookTitle').value;
    const writer = document.getElementById("writer").value;
    const year = document.getElementById('year').value;
    const isComplete = document.getElementById("isFinishedReading").checked;

    const newBook = {
      id: id,
      title: bookTitle,
      writer: writer,
      year: year,
      isComplete: isComplete,
    };

    if (checkForStorage()) {
      let books = JSON.parse(localStorage.getItem(storageKey)); // get all books from localStorage
      books.unshift(newBook); // add new book
      localStorage.setItem(storageKey, JSON.stringify(books));
      window.dispatchEvent(new Event(RENDER_EVENT));
    } else {
      alert("Your browser does not support web storage");
    }
});

function renderBookshelf() {
  // Delete all current existing rendered cards
  completedBooksContainer.innerHTML = '';
  uncompletedBooksContainer.innerHTML = '';

  // Deleted all rendered books, re-render all books in memory
  if (checkForStorage()) {
    const books = JSON.parse(localStorage.getItem(storageKey));
    for (const book of books) {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      cardDiv.classList.add('font-body');
      cardDiv.id = book.id;

      const cardText = document.createElement('div');
      cardText.classList.add('card-text');
    
      const cardTitle = document.createElement('h3');
      cardTitle.innerText = 'Title: ' + book.title;
      cardText.appendChild(cardTitle);
      
      const writer = document.createElement('p');
      writer.innerText = 'Writer: ' + book.writer;
      cardText.appendChild(writer);

      const year = document.createElement('p');
      year.innerText = 'Year: ' + book.year;
      cardText.appendChild(year);

      const cardButtons = document.createElement('div');
      cardButtons.className = 'card-btns';

      const finishButton = document.createElement('button');
      const deleteButton = document.createElement('button');
      finishButton.className = 'btn finish-btn font-body fw-body-500';
      deleteButton.className = 'btn delete-btn font-body fw-body-500';

      finishButton.addEventListener('click', function(e) {
        const bookID = parseInt(e.target.parentNode.parentNode.id);

        const allBooks = JSON.parse(localStorage.getItem(storageKey));
        const targetBook = allBooks.filter(obj => {
          return obj.id === bookID;
        })[0];

        const targetBookIndex = allBooks.indexOf(targetBook);
        allBooks.splice(targetBookIndex, 1); 

        if (targetBook.isComplete === true) {
          targetBook.isComplete = false;
          allBooks.unshift(targetBook);
          localStorage.setItem(storageKey, JSON.stringify(allBooks));
        } else {
          targetBook.isComplete = true;
          allBooks.unshift(targetBook);
          localStorage.setItem(storageKey, JSON.stringify(allBooks));
        }
        window.dispatchEvent(new Event(RENDER_EVENT));
      });

      deleteButton.addEventListener('click', function(e) {
        alert('Are you sure you want to delete this book?');
        const bookID = parseInt(e.target.parentNode.parentNode.id);

        const allBooks = JSON.parse(localStorage.getItem(storageKey));
        const targetBook = allBooks.filter((obj) => {
          return obj.id === bookID;
        })[0];

        const targetBookIndex = allBooks.indexOf(targetBook);
        allBooks.splice(targetBookIndex, 1);  
        localStorage.setItem(storageKey, JSON.stringify(allBooks));
        window.dispatchEvent(new Event(RENDER_EVENT));
      });

      if (book.isComplete === true) {
        finishButton.innerText = "Not finished reading yet?";
        deleteButton.innerText = "Delete Book";

        cardButtons.appendChild(finishButton);
        cardButtons.appendChild(deleteButton);

        cardDiv.appendChild(cardText);
        cardDiv.appendChild(cardButtons);
        completedBooksContainer.appendChild(cardDiv);
      } else {
        finishButton.innerText = "Finished Reading";
        deleteButton.innerText = "Delete Book";

        cardButtons.appendChild(finishButton);
        cardButtons.appendChild(deleteButton);

        cardDiv.appendChild(cardText);
        cardDiv.appendChild(cardButtons);
        uncompletedBooksContainer.appendChild(cardDiv);
      }
    }
  }
}

searchBookForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const allBooks = JSON.parse(localStorage.getItem(storageKey));
  const bookTitleToSearch = document.getElementById(
    'searchBookTitle'
  ).value;

  if (bookTitleToSearch === '') {
    window.dispatchEvent(new Event(RENDER_EVENT));
  } else {
    window.dispatchEvent(new Event(RENDER_EVENT));

    for (let i=0; i < allBooks.length; i++) {
      if (!allBooks[i].title.includes(bookTitleToSearch)) {
        const selectedCard = document.getElementById(allBooks[i].id);
        selectedCard.hidden = true;
      } else {
        const selectedCard = document.getElementById(allBooks[i].id);
        selectedCard.hidden = false;
      }
    }
  }
});