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

const fs = require("fs").promises;
const path = require("path");

const dataPath = path.join(__dirname, "people.json");

/**
 * Read people data from the JSON file
 * @returns { Promise<Array<person>> }
 */
async function readData() {
  try {
    const data = await fs.readFile(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
}

/**
 * Write updated people data back to the JSON file
 * @param { Array<person> } data
 */
async function writeData(data) {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data:", error);
  }
}

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
  return await readData();
}

/**
 * Demo function adding a person
 * @param { string } parsedurl
 * @param { string } method
 * @param { person } person
 * @return { Promise < object > }
 */
async function add(parsedurl, method, person) {
  const people = await readData();

  if (person.id !== undefined) {
    // Update existing person
    const index = people.findIndex((p) => p.id === person.id);
    if (index !== -1) {
      people[index] = person;
      await writeData(people);
      console.log("Updated person:", person);
      console.log("Current people.json data:", people);
      return person;
    }
  }

  // Add new person
  const newId = people.length ? Math.max(...people.map((p) => p.id)) + 1 : 1;
  person.id = newId;
  people.push(person);
  await writeData(people);
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
  const personId = Number(id);

  const people = await readData();
  const index = people.findIndex((p) => p.id === personId);

  if (index === -1) {
    return { success: false, message: `Person with id ${id} not found.` };
  }

  people.splice(index, 1);
  await writeData(people);
  console.log("Deleted person with id:", personId);
  console.log("Current people.json data:", people);
  return { success: true };
}

module.exports = {
  get,
  add,
  delete: del,
};
