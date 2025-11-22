const displayPanel=document.querySelector(".display");
let clickedSteps=[];
let latestResult;
let calculationsMemory=[];
class Display{
    constructor(displayPanel){
        this.displayPanel=displayPanel;
    }
    clearDisplay(){
        this.displayPanel.textContent="";
    } 
    renderDisplay(content){
        this. displayPanel.textContent=content;
    }
}

const displays=new Display(displayPanel);//to handle all display actions

function initializeCalculator(){

}//on content loaded

function getButton(classname){
    const button=document.querySelector(`.${classname}`);
    return button;
}//helper function

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
};//all the buttons



class SpecialOperations{
    constructor(number,symbol){
        this.number=number;
        this.symbol=symbol;
    }
}

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

function checkType(button){
switch(button){
    case button.classList.contains("number") : return "number";
    case button.classList.contains("del") : return "delete";
    case button.classList.contains("mr") : return "memory recall";
    case button.classList.contains("mc") : return "memory clear";
    case button.classList.contains("m-minus") : return "memory minus";
    case button.classList.contains("m-plus") : return "memory plus";
    case button.classList.contains("ac") : return "ac"; //and ce
     case button.classList.contains("square-root") : return "square root";
    case button.classList.contains("percentage") : return "percentage";
    case button.classList.contains("divide") : return "divide";
    case button.classList.contains("multiply") : return "delete";
    case button.classList.contains("subtract") : return "delete";
    case button.classList.contains("positive-negative") : return "delete";
    case button.classList.contains("equals") : return "delete";
    case button.classList.contains("decimal") : return "delete";
    case button.classList.contains("exponent") : return "delete";
    case button.classList.contains("r2-two-decimal") : return "delete";
    case button.classList.contains("r0-zero-decimal") : return "delete";           
}
}


function limitCalculatedStepsToThree(){

}

function handleExtraSteps(arrayOfSteps,latestStep){

 
}
 function savePreviousCalculationToMemory(array){

 }

