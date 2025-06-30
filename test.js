// Test file for variable counting functionality

// Simple variable declarations
let name = "John";
const age = 25;
var city = "New York";

// Multiple variable declarations
let firstName, lastName, email;
const [x, y, z] = [1, 2, 3];

// Function with parameters
function greetUser(userName, userAge) {
    let message = `Hello ${userName}, you are ${userAge} years old`;
    return message;
}

// Arrow function with parameters
const addNumbers = (a, b) => {
    let result = a + b;
    return result;
};

// Single parameter arrow function
const square = num => num * num;

// Destructuring assignments
const { title, author, year } = book;
const [first, second, ...rest] = array;

// Class with properties
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    getInfo() {
        let info = `${this.name} is ${this.age} years old`;
        return info;
    }
}

// For loop variables
for (let i = 0; i < 10; i++) {
    let item = items[i];
    console.log(item);
}

// Try-catch with variable
try {
    let data = JSON.parse(jsonString);
} catch (error) {
    let errorMessage = error.message;
}

// Object destructuring in function parameters
function processUser({ name, age, email }) {
    let userInfo = { name, age, email };
    return userInfo;
}

// Array destructuring in function parameters
function processArray([first, second, third]) {
    let result = first + second + third;
    return result;
}

// Lambda expressions
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
const filtered = numbers.filter(num => num > 2);

// Template literals with variables
let template = `User: ${name}, Age: ${age}`;

// Export statements
export { name, age, city };
export default Person; 