const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

let notes = JSON.parse(localStorage.getItem("quicknotes")) || [];

function render(searchTerm = "") {
    notesList.textContent = "";

    const filteredNotes = notes.filter(note =>
        note.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredNotes.length === 0 && searchTerm.trim() !== "") {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
    }

    filteredNotes.forEach(note => {
        const li = document.createElement("li");
        li.classList.add("note");

        if (note.category === "Personal") {
            li.classList.add("category-personal");
        } else if (note.category === "Work") {
            li.classList.add("category-work");
        } else if (note.category === "Study") {
            li.classList.add("category-study");
        }

        const text = document.createElement("p");
        text.textContent = note.text;

        const category = document.createElement("small");
        category.textContent = note.category;
        category.classList.add("note-category");

        const date = document.createElement("p");
        date.textContent = note.createdAt;
        date.classList.add("note-date");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            notes = notes.filter(item => item.id !== note.id);
            saveNotes();
            render(searchInput.value);
        });

        li.appendChild(text);
        li.appendChild(category);
        li.appendChild(date);
        li.appendChild(deleteButton);

        notesList.appendChild(li);
    });

    updateCount();
}

function updateCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

function saveNotes() {
    localStorage.setItem("quicknotes", JSON.stringify(notes));
}

noteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

    const note = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(note);

    saveNotes();

    errorMessage.textContent = "";
    noteInput.value = "";

    render(searchInput.value);
});

searchInput.addEventListener("input", () => {
    render(searchInput.value);
});

render();