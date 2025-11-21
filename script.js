const displayPanel=document.querySelector(".display");
function getButton(classname){
    const button=document.querySelector(`.${classname}`);
    return button;
}

const buttons = {
    // Memory Operations (r1)
    mc: getButton("mc"),
    mr: getButton("mr"),
    mMinus: getButton("m-minus"),
    mPlus: getButton("m-plus"),
    del: getButton("del"), 
    
    // Utility and Special Keys
    ac: getButton("ac"),
    squareRoot: getButton("square-root"),
    percentage: getButton("percentage"),
    convertPosNeg: getButton("positive-negative"),
    pie: getButton("pie"),
    
    // Standard Operators
    divide: getButton("divide"),
    multiply: getButton("multiply"),
    add: getButton("add"),
    subtract: getButton("subtract"),
    equals: getButton("equals"),
    exponent: getButton("exponent"),

    // Digits
    seven: getButton("seven"),
    eight: getButton("eight"),
    nine: getButton("nine"),
    four: getButton("four"),
    five: getButton("five"),
    six: getButton("six"),
    one: getButton("one"),
    two: getButton("two"),
    three: getButton("three"),
    zero: getButton("zero"),   

    // Decimals and Rounding
    decimal: getButton("decimal"), 
    oneDecimal: getButton("r0-zero-decimal"),
    twoDecimal: getButton("r2-two-decimal")
};
class ArithmeticOperations{
    constructor(a,b){
        this.a=a;
        this.b=b;
    }
add(){return this.a + this.b;}
subtract(){return this.a - this.b;}
multiply(){return this.a * this.b;}
divide(){return this.a / this.b;}
raiseToPower(){return this.a ** this.b;}
squareRoot(){return this.a ** (1/this.b);}
}
class SpecialOperations{
    constructor(number,symbol){
        this.number=number;
        this.symbol=symbol;
    }
}
function calculate(a, b, operator) {
    let mathOperation = new ArithmeticOperations(a, b);

    switch (operator) {
        case "+": return mathOperation.add();
        case "-": return mathOperation.subtract();
        case "*": return mathOperation.multiply();
        case "/": return mathOperation.divide();
        case "xʸ": return mathOperation.raiseToPower();
        case "√x": return mathOperation.squareRoot();
        default: throw new error("Error: Invalid operator");
    }
}
function clearDisplay(){
    displayPanel.textContent="";
}
function display(content){
    displayPanel.textContent=content;
}

//let maths=new arithmeticOperations(3,4);

//console.log(maths.add(),maths.subtract(),maths.multiply(),maths.divide());
console.log(calculate(9,2,"√x"))
display("successful display test");
