import { getdata, putdata, deletedata } from "./api.js";
import {
  showform,
  getformfieldvalue,
  setformfieldvalue,
  clearform,
  gettablebody,
  cleartablerows,
} from "./form.js";
import { findancestorbytype } from "./dom.js";

document.addEventListener("DOMContentLoaded", async function () {
  document
    .getElementById("addperson")
    .addEventListener("click", addpersoninput);
  await gopeople();
});

/**
 *
 * @returns { Promise< object > }
 */
async function fetchpeople() {
  return await getdata("people");
}

/**
 * @param { string } name
 * @param { string } email
 * @param { string } notes
 * @returns { Promise< object > }
 */
async function addperson(name, email, notes) {
  await putdata("people", { name, email, notes });
}

/**
 *
 * @param { string } id
 * @param { string } name
 * @param { string } email
 * @param { string } notes
 */
async function updateperson(id, name, email, notes) {
  await putdata("people", { id, name, email, notes });
}

/**
 * @returns { Promise }
 */
async function gopeople() {
  const p = await fetchpeople();
  cleartablerows("peopletable");

  for (const pi in p) {
    addpersondom(p[pi]);
  }
}

/**
 *
 */
function addpersoninput() {
  clearform("personform");
  showform("personform", async () => {
    await addperson(
      getformfieldvalue("personform-name"),
      getformfieldvalue("personform-email"),
      getformfieldvalue("personform-notes")
    );
    await gopeople();
  });
}

/**
 *
 */
function editperson(ev) {
  clearform("personform");

  // Get the person row
  const personrow = findancestorbytype(ev.target, "tr");
  const person = personrow.person;

  // Fill the form fields
  setformfieldvalue("personform-name", person.name);
  setformfieldvalue("personform-email", person.email || "");
  setformfieldvalue("personform-notes", person.notes || "");

  // Show the form and define what happens on Save
  showform("personform", async () => {
    // Update the person with new values
    await updateperson(
      person.id,
      getformfieldvalue("personform-name"),
      getformfieldvalue("personform-email"),
      getformfieldvalue("personform-notes")
    );

    // Refresh the table to display updated email and notes
    await gopeople();
  });
}

async function deletepersonevent(ev) {
  const personrow = findancestorbytype(ev.target, "tr");
  const person = personrow.person;

  const confirmDelete = confirm(
    `Are you sure you want to delete ${person.name}?`
  );
  if (!confirmDelete) return;

  const response = await fetch("/api/people", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: person.id }),
  });

  if (!response.ok) {
    alert("Error deleting person.");
    return;
  }

  await gopeople();
}

/**
 *
 * @param { object } person
 */
export function addpersondom(person) {
  const table = gettablebody("peopletable");
  const newrow = table.insertRow();

  const cells = [];
  for (let i = 0; i < 11; i++) {
    cells.push(newrow.insertCell(i));
  }

  // @ts-ignore
  newrow.person = person;
  cells[0].innerText = person.name;
  cells[8].innerText = person.email;
  cells[9].innerText = person.notes;

  // Create Delete button (red)
  const deletebutton = document.createElement("button");
  deletebutton.textContent = "Delete";
  deletebutton.classList.add("btn-delete");
  deletebutton.addEventListener("click", deletepersonevent);

  const editbutton = document.createElement("button");
  editbutton.textContent = "Edit";
  editbutton.className = "btn-edit";
  editbutton.addEventListener("click", editperson);

  // Container for buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "cell-buttons";
  buttonContainer.appendChild(editbutton);
  buttonContainer.appendChild(deletebutton);

  cells[10].appendChild(buttonContainer);
}
