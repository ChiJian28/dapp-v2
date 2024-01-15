// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Persons {

    // create an object
    struct Person {
        string name;
        uint256 age;
        uint timestamp;
        string message;
    }

    Person[] public persons; // 使用数组存储所有的 Person 对象

    function getPersonArray() public view returns (Person[] memory) {
        return persons;
    }

    function setPersonObj(
        string memory name,
        uint256 age,
        string memory message
    ) external {
        Person memory newPerson = Person(name, age, block.timestamp ,message);
        persons.push(newPerson); // 将新 Person 对象添加到数组中
    }

    function updatePerson(uint256 i, Person memory updatedPerson) external {
        require(i < persons.length, "Index out of bounds");

        // 添加输入验证
        require(bytes(updatedPerson.name).length > 0, "Name cannot be empty");
        require(updatedPerson.age > 0, "Age must be greater than zero");

        persons[i] = updatedPerson;
    }

    function removePerson(uint256 index) external {
        require(index < persons.length, "Index out of bounds");

        // 将被删除的元素移去数组的末尾
        persons[index] = persons[persons.length - 1];

        // 删除最后一个元素
        persons.pop();
    }
}