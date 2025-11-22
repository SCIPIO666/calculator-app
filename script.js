const displayPanel=document.querySelector(".display");
let clickedSteps=[];
let latestResult;
let calculationsMemory={};

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

function initializeCalculator(){

}

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

const displays=new Display(displayPanel);


function limitCalculatedStepsToThree(){
    const allNumbers=document.querySelectorAll(".numbers");
    allNumbers.forEach(number=>{
        number.addEventListener("click",e=>{
            clickedSteps.length<3 ? clickedSteps.push(e.target.textContent)  : handleExtraSteps(clickedSteps,e.target.textContent);
            clickedSteps.push(e.target.textContent);
            displays.renderDisplay(displayPanel.textContent+e.target.textContent);//no calculations yet,only displaying
        });
    });
}

function handleExtraSteps(arrayOfSteps,latestStep){

    if(arrayOfSteps.length==3){
        savePreviousCalculationToMemory();//to save previous calculation and carry over result
        arrayOfSteps.push(latestStep);
        latestResult=calculate(arrayOfSteps[0],arrayOfSteps[2],arrayOfSteps[1]);
        displays.renderDisplay(latestResult);
        //the display to compute as soon as it has two operands and an operator so that the next input will be aggregated to the calculations chain
    }else{

        arrayOfSteps.push(latestStep);//arrayOfSteps  keeps track of buttons pressed and their implications,and determines end and begin of new calculation
        latestResult=calculate(arrayOfSteps[0],arrayOfSteps[2],arrayOfSteps[1]);
        displays.renderDisplay(latestResult);
    }
 
}

