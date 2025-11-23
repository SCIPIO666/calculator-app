//------------global variables for state management--------------------------------//
const mathDisplayPanel=document.querySelector("#math");//display screen
const resultDisplayPanel=document.querySelector("#result");//display screen
let latestResult;//calculate latest computation prompt
let CurrentState=[];//to keep track of user current step
let calculationsMemory=[];//save objects of operators ,operands and results for each computation

let calculatorState = {
    currentOperand: "",     // The number currently being entered 
    previousOperand: "",    // The first number 
    operation: "",   // The operator (+, -, *, etc.)
    isResultDisplayed: false // Flag for new input
};

//---------------------------------------------------------------------------------//
class Display{
    constructor(mathDisplayPanel,resultDisplayPanel){
        this.mathDisplayPanel=mathDisplayPanel;
        this.resultDisplayPanel=resultDisplayPanel;
    }
    clearDisplay(){
        this.mathDisplayPanel.textContent="";
        this.resultDisplayPanel.textContent="";
    } 
    renderDisplay(mathContent,resultContent){
        this.mathDisplayPanel.classList.remove="reduce";
        this.resultDisplayPanel.classList.remove="reduce";
        this.mathDisplayPanel.textContent=mathContent;
        this.resultDisplayPanel.textContent=resultContent;
    }
    reduceMathFont(){
        this.mathDisplayPanel.classList.add="reduce";
    }
    reduceResultFont(){
        this.resultDisplayPanel.classList.add="reduce";  
    }
}

const displays=new Display(mathDisplayPanel,resultDisplayPanel);//to handle all display actions

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
        case "x": return mathOperation.multiply();
        case "÷": return mathOperation.divide();
        case "xʸ": return mathOperation.raiseToPower();
        case "√x": return mathOperation.squareRoot();
        default: throw new error("Error: Invalid operator");
    }
}

function checkType(button){
switch(true){
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
    case button.classList.contains("add") : return "add";    
    case button.classList.contains("multiply") : return "multiply";
    case button.classList.contains("subtract") : return "subtract";
    case button.classList.contains("operator") : return "operator";    
    case button.classList.contains("positive-negative") : return "positive-negative";
    case button.classList.contains("equals") : return "equals";
    case button.classList.contains("decimal") : return "decimal";
    case button.classList.contains("exponent") : return "exponent";
    case button.classList.contains("r2-two-decimal") : return "two decimals";
    case button.classList.contains("r0-zero-decimal") : return "zero/no decimals";  
    default: return "unknown";         
}
}
class HandleButtonClicks{
    constructor(button,calculatorState,DisplayInstance,calculateFunction){
        this.button=button;
        this.buttonType=checkType(this.button);
        this.state= calculatorState; //calculatorState
        this.DisplayInstance= DisplayInstance;  //displays
        this.calculateFunction=calculateFunction;//calculate(a, b, operator)
        this.result= undefined;
        this.math=undefined;
    }

    updateState() {
        switch (this.buttonType) {
            case "number":
            case "decimal"://pressed decimal/number goes to join current stand alone number
                if (this.buttonType === "decimal" && this.state.currentOperand.includes(".")) return;//prevent double decimal click
                this.state.currentOperand += this.button.textContent;
                this.DisplayInstance.renderDisplay(this.state.currentOperand);//display joined value
                break;

            case "add": 
            case "subtract":
            case "multiply":
            case "operator":      
            case "divide":// +, -, *, /,...time to graduate current number to previous number status,and store the operator
                if (this.state.previousOperand === "" && this.state.currentOperand === "") return;                   
                if(this.state.previousOperand === "" && this.state.currentOperand !== "" && this.state.operation===""){
                    // Graduate current to previous if this is the first operator
                    this.state.previousOperand = this.state.currentOperand;
                    this.state.currentOperand = "";
                    this.state.operation=this.button.textContent
                    this.math=`${this.state.previousOperand}${this.state.operation}`;
                    this.DisplayInstance.renderDisplay(this.math,"");
                        if(this.math.length>8){
                            this.DisplayInstance.reduceMathFont();
                        }                     
                    this.state.isResultDisplayed = false;                    
                }
                 if (this.state.previousOperand !== "" && this.state.currentOperand !== "" && this.state.operation !=="") {
                        
                    console.log(this.state)
                    this.result = this.calculateFunction(
                        parseFloat(this.state.previousOperand),
                        parseFloat(this.state.currentOperand),
                        this.state.operation
                    );
                    this.math=`${this.state.previousOperand}${this.state.operation}${this.state.currentOperand}`;                    
                    this.DisplayInstance.renderDisplay(this.math,this.result);
                        if(this.math.length>8){
                            this.DisplayInstance.reduceMathFont();
                        } 
                        if(this.result.length>8){
                            this.DisplayInstance.reduceResultFont();
                        }                     
                    this.state.previousOperand = this.result;//as soon as calculated graduated t previous operand .toString()
                    this.state.currentOperand = "";
                    this.state.isResultDisplayed = true;                       
                }                     
                break;

            case "equals":
                if (this.state.previousOperand === "" || this.state.currentOperand === "" || this.state.operation==="" ) return;
                if (this.state.previousOperand !== "" && this.state.currentOperand !== "" && this.state.operation!=="" ){
                        this.result = this.calculateFunction(
                        parseFloat(this.state.previousOperand),
                        parseFloat(this.state.currentOperand),
                        this.state.operation
                        );//utilizing the global calculate function
                        // Update state
                    this.math=`${this.state.previousOperand}${this.state.operation}${this.state.currentOperand}`;                    
                    this.DisplayInstance.renderDisplay(this.math,this.result);
                        if(this.math.length>8){
                            this.DisplayInstance.reduceMathFont();
                        } 
                        if(this.result.length>8){
                            this.DisplayInstance.reduceResultFont();
                        }              
                    this.state.currentOperand = this.result; //the result stored as current operand now .toString()
                    this.state.previousOperand = "";
                    this.state.operation = "";
                    this.state.isResultDisplayed = true;
                }
     
                break;

            case "ac":
                this.DisplayInstance.renderDisplay("");//clear display
                this.state.currentOperand = "";
                this.state.previousOperand = "";
                this.state.operation = "";
                this.state.isResultDisplayed = false;
                break;
        }
    }
}

//---------------------------------------------initializing  the calculator-----------------------------//
function initializeCalculator(){
    const allButtons=document.querySelectorAll(".button");
    allButtons.forEach(button=>{

        button.addEventListener("click",e=>{
                const buttonClick= new HandleButtonClicks(button,calculatorState,displays,calculate);
                buttonClick.updateState();
                console.log(calculatorState)
        });
    });
}//on content loaded
initializeCalculator()
//---------------------------------------------initializing  the calculator-----------------------------//
