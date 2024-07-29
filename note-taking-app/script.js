document.addEventListener("DOMContentLoaded", function () {
  const noteHeadingInput = document.getElementById("note-heading");
  const noteInput = document.getElementById("note-input");
  const addNoteButton = document.getElementById("add-note");
  const saveChangesButton = document.getElementById("save-changes");
  const notesContainer = document.getElementById("notes");
  const alertArea = document.getElementById("alert-area");
  let currentEditId = null;

  addNoteButton.addEventListener("click", function () {
    const noteHeading = noteHeadingInput.value.trim();
    const noteContent = noteInput.innerHTML.trim();

    if (!noteHeading) {
      showAlert("Please enter a note heading.", "danger");
      return;
    }

    if (noteHeading && noteContent) {
      const noteId = "note-" + new Date().getTime();
      createNoteCard(noteId, noteHeading, noteContent);

      noteHeadingInput.value = "";
      noteInput.innerHTML = "";
    }
  });

  saveChangesButton.addEventListener("click", function () {
    const noteHeading = noteHeadingInput.value.trim();
    const noteContent = noteInput.innerHTML.trim();
    if (noteHeading && noteContent && currentEditId) {
      const noteCardHeader = document.querySelector(
        `#${currentEditId} .card-header button.btn-link`
      );
      const noteCardBody = document.querySelector(
        `#${currentEditId} .card-body`
      );

      noteCardHeader.innerHTML = `${noteHeading} <i class="fas fa-chevron-down"></i>`;
      noteCardBody.innerHTML = noteContent;

      noteHeadingInput.value = "";
      noteInput.innerHTML = "";
      addNoteButton.style.display = "block";
      saveChangesButton.style.display = "none";
      currentEditId = null;
    }
  });

  function createNoteCard(noteId, noteHeading, noteContent) {
    const noteCard = document.createElement("div");
    noteCard.className = "card";
    noteCard.id = noteId;

    const noteCardHeader = document.createElement("div");
    noteCardHeader.className = "card-header";
    noteCardHeader.innerHTML = `
          <h5 class="mb-0">
              <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#${noteId}-content" aria-expanded="false" aria-controls="${noteId}-content">
                  ${noteHeading} <i class="fas fa-chevron-down"></i>
              </button><button class="edit-note">Edit</button>
          </h5>
      `;

    const noteCardBody = document.createElement("div");
    noteCardBody.id = `${noteId}-content`;
    noteCardBody.className = "collapse";
    noteCardBody.innerHTML = `
          <div class="card-body">
              ${noteContent}
          </div>
      `;

    noteCard.appendChild(noteCardHeader);
    noteCard.appendChild(noteCardBody);
    notesContainer.appendChild(noteCard);

    // Ensure only one note is expanded at a time
    $(`#${noteId}-content`).on("show.bs.collapse", function () {
      $(".collapse").not(this).collapse("hide");
    });

    // Initialize the collapse component to manage arrow rotation
    $(`#${noteId}-content`).on("show.bs.collapse", function () {
      $(this)
        .siblings(".card-header")
        .find(".btn-link")
        .removeClass("collapsed");
    });
    $(`#${noteId}-content`).on("hide.bs.collapse", function () {
      $(this).siblings(".card-header").find(".btn-link").addClass("collapsed");
    });

    // Edit button functionality
    noteCardHeader
      .querySelector(".edit-note")
      .addEventListener("click", function () {
        noteHeadingInput.value = noteHeading;
        noteInput.innerHTML = noteContent;
        addNoteButton.style.display = "none";
        saveChangesButton.style.display = "block";
        currentEditId = noteId;
      });
  }

  // Handle pressing Enter in the note heading input
  noteHeadingInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent Enter from creating a new line
      noteInput.focus(); // Move focus to the note content input
      document.execCommand("insertLineBreak"); // Insert a new line break
    }
  });

  function showAlert(message, type) {
    alertArea.innerHTML = `
          <div class="alert alert-${type} alert-dismissible fade show" role="alert">
              ${message}
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
      `;
  }
});
