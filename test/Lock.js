const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Persons", function () {
  let Persons;
  let persons;

  beforeEach(async function () {
    Persons = await ethers.getContractFactory("Persons");
    persons = await Persons.deploy();
    await persons.waitForDeployment();
  });

  describe("setPersonObj function", function () {
    it("Should add a new Person to the array", async function () {
      const initialPersonsCount = await persons.personsCount();

      await persons.setPersonObj("John", 25, "Hello, World!");

      const newPersonsCount = await persons.personsCount();
      expect(newPersonsCount).to.equal(initialPersonsCount + 1);

      const newPerson = await persons.persons(initialPersonsCount);
      expect(newPerson.name).to.equal("John");
      expect(newPerson.age).to.equal(25);
      expect(newPerson.message).to.equal("Hello, World!");
    });
  });

  describe("updatePerson function", function () {
    it("Should update an existing Person in the array", async function () {
      await persons.setPersonObj("Alice", 30, "Greetings!");

      const initialPerson = await persons.persons(0);

      await persons.updatePerson(0, { name: "Alice Updated", age: 35, message: "New Message" });

      const updatedPerson = await persons.persons(0);
      expect(updatedPerson.name).to.equal("Alice Updated");
      expect(updatedPerson.age).to.equal(35);
      expect(updatedPerson.message).to.equal("New Message");
      expect(updatedPerson.timestamp).to.equal(initialPerson.timestamp);
    });

    it("Should revert if the index is out of bounds", async function () {
      await expect(persons.updatePerson(1, { name: "Updated", age: 25, message: "Hello" })).to.be.revertedWith("Index out of bounds");
    });

    it("Should revert if the name is empty", async function () {
      await persons.setPersonObj("Bob", 40, "Hi there!");

      await expect(persons.updatePerson(0, { name: "", age: 45, message: "Empty Name" })).to.be.revertedWith("Name cannot be empty");
    });

    it("Should revert if the age is not greater than zero", async function () {
      await persons.setPersonObj("Charlie", 50, "Hola!");

      await expect(persons.updatePerson(0, { name: "Charlie Updated", age: 0, message: "Zero Age" })).to.be.revertedWith("Age must be greater than zero");
    });
  });

  describe("removePerson function", function () {
    it("Should remove an existing Person from the array", async function () {
      await persons.setPersonObj("David", 55, "Goodbye!");

      const initialPersonsCount = await persons.personsCount();

      await persons.removePerson(0);

      const newPersonsCount = await persons.personsCount();
      expect(newPersonsCount).to.equal(initialPersonsCount - 1);
    });

    it("Should revert if the index is out of bounds", async function () {
      await expect(persons.removePerson(1)).to.be.revertedWith("Index out of bounds");
    });
  });

  describe("getPersonArray function", function () {
    it("Should return the array of Persons", async function () {
      // Assuming there are already some persons added in previous test cases
      const result = await persons.getPersonArray();
      
      // Update the length expectation based on the number of persons added
      expect(result.length).to.be.at.least(1);
  
      // You can still check the details of the first person in the array
      expect(result[0].name).to.equal("Eva");
      expect(result[0].age).to.equal(60);
      expect(result[0].message).to.equal("See you!");
    });
  });
  
});
