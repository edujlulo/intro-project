/**
 * @typedef { Object } person
 * @property { number } id
 * @property { string } name - The name of the person.
 * @property { string } email - The email address of the person.
 * @property { string } [ notes ] - Additional notes about the person (optional).
 */

/**
 * @type { Array< person > }
 */
const people = [
  { id: 1, name: "Kermit Frog", email: "", notes: "" },
  { id: 2, name: "Miss Piggy", email: "", notes: "" },
];

/**
 * Demo function to return an array of people objects
 * @param { URL } parsedurl
 * @returns { Promise< Array< person > > }
 */
async function get(parsedurl) {
  return people;
}

/**
 * Demo function adding a person
 * @param { string } parsedurl
 * @param { string } method
 * @param { person } person
 * @return { Promise < object > }
 */
async function add(parsedurl, method, person) {
  if (undefined !== person.id) {
    people.some((element) => {
      if (element.id == person.id) {
        element.name = person.name;
        element.email = person.email;
        element.notes = person.notes;
        return true;
      }
      return false;
    });
    return person;
  }

  person.id =
    people.reduce((maxid, obj) => {
      return Math.max(maxid, obj.id);
    }, -Infinity) + 1;

  people.push(person);

  return person;
}

/**
 * Delete a person by id
 * @param { URL } parsedurl
 * @param { string } method
 * @param { object } receivedobj
 * @returns { Promise< object > }
 */
async function del(parsedurl, method, receivedobj) {
  const { id } = receivedobj;

  // Convert id to number (just in case it comes as string)
  const personId = Number(id);

  // Find index of the person to delete
  const index = people.findIndex((p) => p.id === personId);

  if (index === -1) {
    // If not found, return an error object
    return { success: false, message: `Person with id ${id} not found.` };
  }

  // Remove the person from the array
  people.splice(index, 1);

  return { success: true };
}

module.exports = {
  get,
  add,
  delete: del,
};
