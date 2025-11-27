//------------global variables for state management--------------------------------//
const mathDisplayPanel=document.querySelector("#math");//display screen
const resultDisplayPanel=document.querySelector("#result");//display screen
let calculationsMemory=[];//save objects of operators ,operands and results for each computation

let calculatorState = {
    currentOperand: "",     // The number currently being entered 
    previousOperand: "",    // The first number 
    operation: "",   // The operator (+, -, *, etc.)
    isResultDisplayed: false ,// Flag for new input
    percentageType:"",
    currentOperandIsPercentageValue: false,
    resultsInMemory: [],//save calculated results
    currentMemoryCalculation: "",
    memoryValue: "",
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
        this.mathDisplayPanel.textContent=mathContent;
        this.resultDisplayPanel.textContent=resultContent;
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
    multiply(){
        if(this.a==0 || this.b==0){
            this.reject("multiply");
            return
        }
        return this.a * this.b;
    }
    divide(){
        if(this.a==0 || this.b==0){
            this.reject("divide");
            return
        }
        return this.a / this.b;
    }
    raiseToPower(){
        return this.a ** this.b;
    }
    squareRoot(){
        if(this.a==0 || this.b==0){
            this.reject("squareRoot");
            return
        }
        return this.a ** (1/this.b);
    }
    reject(method){
            console.error(`invalid: cant ${method} with zero`);
    }

}

function percentageMathHandler(type,a,b=""){
    
    const percentageState={
         percentageType : type,
         operand1: parseFloat(a),
         operand2: parseFloat(b),
         percentageResult:"",
        isResultDisplayed: false ,// Flag for new input   
    }
    let math;
    switch (percentageState.percentageType){    
        case "+" : //i.e 12 plus 10% is? ---> 12 + (12 × 10%) = 13.2-- 12 + 10 %  then =
            math=(percentageState.operand1) + ((percentageState.operand2/100)*(percentageState.operand1));
            return math.toFixed(1);
        break;

        case "-": //10 minus 10% is?---->10 - (10 × 10%) = 9----- 10 − 10 %   then =
            math=(percentageState.operand1) - ((percentageState.operand2/100)*(percentageState.operand1));
            return math.toFixed(1);
        break;

        case "x"://10% of 15 is?------->15 × 10% = 1.5 --------- 15 × 10 %   then =
            math=(percentageState.operand2/100)*(percentageState.operand1);
            return math.toFixed(1);
        break;

        case "÷"://15 is 10% of ?------> 15/10%=150------------- 15 ÷ 10 %   then =
            math=(percentageState.operand1*100) / percentageState.operand2;
            return math.toFixed(1);
        break;
    }        
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
    case button.classList.contains("ms") : return "memory store";
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
    case button.classList.contains("pie") : return "pie";    
    case button.classList.contains("exponent") : return "exponent";
    case button.classList.contains("r2-two-decimal") : return "two decimals";
    case button.classList.contains("r0-zero-decimal") : return "zero/no decimals"; 
    case button.classList.contains("prev") : return "prev";
    case button.classList.contains("next") : return "next";     
    default: return "unknown";             
}
}

class HandleButtonClicks{
    constructor(button,calculatorState,DisplayInstance,calculateFunction,percentageFunction){
        this.button=button;
        this.buttonType=checkType(this.button);
        this.state= calculatorState; //calculatorState
        this.DisplayInstance= DisplayInstance;  //displays
        this.calculateFunction=calculateFunction;//calculate(a, b, operator)
        this.percentageFunction=percentageFunction;//percentageOperations(typeOfPercentageOperation)
        this.result= undefined;
        this.math=undefined;
    }

    updateMemory(){
        let arrayLength=this.state.resultsInMemory.length;
        let memoryObject={//saving results to memory
             value1: this.state.previousOperand,
            operator: this.state.operation,
            value2:this.state.currentOperand,
            result:this.result,
            mathDisplay: this.math,
        };
        if(arrayLength<1){
            this.state.resultsInMemory[0]=memoryObject;
        }else{
            this.state.resultsInMemory[arrayLength]=memoryObject;
        }                
    }


    retrievePrevCalculation(){
        const historyLength = this.state.resultsInMemory.length;
        if (historyLength === 0) return;
        let currentIndex = this.state.currentMemoryCalculation === ""? historyLength - 1 : this.state.currentMemoryCalculation;
        // Decrementing the index, ensuring it doesn't go below 0
        const newIndex = Math.max(0, currentIndex - 1);     
        // Updating the state and display if the index changed
        if (newIndex !== currentIndex || currentIndex === historyLength - 1) {
            this.state.currentMemoryCalculation = newIndex;
            const memoryItem = this.state.resultsInMemory[newIndex];
            this.DisplayInstance.renderDisplay(memoryItem.mathDisplay, memoryItem.result);
        }
    }
    retrieveNextCalculation(){
        const historyLength = this.state.resultsInMemory.length;
        if (historyLength === 0) return; 
        const lastIndex = historyLength - 1;
        // If it's the first time being called, starting at index 0.
        let currentIndex = this.state.currentMemoryCalculation === "" ? 0: this.state.currentMemoryCalculation; 
        // Incrementing the index, ensuring it doesn't go beyond the last index
        const newIndex = Math.min(lastIndex, currentIndex + 1);
        // Updating the state and display if the index changed
        if (newIndex !== currentIndex || currentIndex === 0) {
            this.state.currentMemoryCalculation = newIndex;
            const memoryItem = this.state.resultsInMemory[newIndex];
            this.DisplayInstance.renderDisplay(memoryItem.mathDisplay, memoryItem.result);
        }
    }    
    updateState() {
        switch (this.buttonType) {
            case "number":
            case "pie":   
            case "decimal"://pressed decimal/number goes to join current stand alone number
                if (this.buttonType === "decimal" && this.state.currentOperand.includes(".")) return;//prevent double decimal click
                if(this.buttonType === "pie" && this.state.currentOperand !=="") return;
                if(this.buttonType==="pie" && this.state.currentOperand ===""){
                            this.state.currentOperand = 3.1415926536;
                            this.DisplayInstance.renderDisplay(`${this.state.previousOperand.toLocaleString()} ${this.state.operation} ${this.state.currentOperand.toLocaleString()}`,"");//display joined value  
                            return;                          
                    }else{
                            this.state.currentOperand += this.button.textContent;
                            this.DisplayInstance.renderDisplay(`${this.state.previousOperand.toLocaleString()} ${this.state.operation} ${this.state.currentOperand.toLocaleString()}`,"");//display joined value
                    }
            break;

            case "add": 
            case "subtract":
            case "multiply":
            case "operator":
            case "xʸ":
            case "square root":                
            case "operator":                                  
            case "divide":// +, -, *, /,...time to graduate current number to previous number status,and store the operator

                if(this.state.previousOperand === "" && this.state.currentOperand !== "" && this.state.operation===""){
                    // Graduate current to previous if this is the first operator
                    this.state.previousOperand = this.state.currentOperand;
                    this.state.currentOperand = "";
                    this.state.operation=this.button.textContent;
                    this.result="";
                    this.math=`${this.state.previousOperand} ${(this.state.operation)}`;
                    this.DisplayInstance.renderDisplay(this.math.toLocaleString(),this.result);                    
                    this.state.isResultDisplayed = false;                    
                }

               if(this.state.previousOperand === "" && this.state.currentOperand !== "" && this.state.operation==="" && this.state.percentageType==="" && this.state.currentOperandIsPercentageValue===true){//handle percentage operations
                    // Graduate current to previous if this is the first operator
                    this.state.previousOperand = this.state.currentOperand;
                    this.state.currentOperand = "";
                    this.state.operation=this.button.textContent;
                    this.state.isResultDisplayed = false;
                    this.state.currentOperandIsPercentageValue=false; 
                    this.result="";
                    this.math=`${this.state.previousOperand} ${(this.state.operation)}`;                                              
                    this.DisplayInstance.renderDisplay(this.math.toLocaleString(),this.result);                    
                                 
                } 

                 if (this.state.previousOperand !== "" && this.state.currentOperand !== "" && this.state.operation !=="") {
                    this.result = this.calculateFunction(
                        parseFloat(this.state.previousOperand),
                        parseFloat(this.state.currentOperand),
                        this.state.operation
                    );

                    this.math=`${this.state.previousOperand.toLocaleString()} ${this.state.operation} ${this.state.currentOperand.toLocaleString()}`;     
                    this.DisplayInstance.renderDisplay(this.math,this.result.toLocaleString()); 
                    this.updateMemory();                  
                    this.state.previousOperand = this.result;//as soon as calculated graduated to previous operand .toString()
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
                    if(this.state.operation==="xʸ"){
                        this.math=`${this.state.previousOperand} ^ ${this.state.currentOperand.toLocaleString()}`;
                    }else{
                        this.math=`${this.state.previousOperand} ${this.state.operation} ${this.state.currentOperand}`;  
                    }                                            
                    this.DisplayInstance.renderDisplay(this.math.toLocaleString(),this.result.toLocaleString()); 

                    this.updateMemory();
                    //updating state                     
                    this.state.currentOperand = this.result; //the result stored as current operand now .toString()
                    this.state.previousOperand = "";
                    this.state.operation = "";
                    this.state.isResultDisplayed = true;
                }
                console.log(this.state.resultsInMemory)
                break;

            case "ac":
                this.DisplayInstance.renderDisplay("");//clear display
                this.state.currentOperand = "";
                this.state.previousOperand = "";
                this.state.operation = "";
                this.state.isResultDisplayed = false;
                break;
        
    ////////////////////////////unary operators///////////////////////////////

        case "positive-negative":
            if(this.state.currentOperand !=="" && this.state.isResultDisplayed===true){
                this.state.currentOperand=parseFloat(this.state.currentOperand) * -1;
                this.DisplayInstance.renderDisplay(this.state.currentOperand,""); 
                this.state.isResultDisplayed= false;
            }
            this.state.currentOperand=this.state.currentOperand*-1;
            this.DisplayInstance.renderDisplay(this.state.currentOperand,"")
        break;

        case "two decimals":
            if(this.state.currentOperand==="") return;
            if(this.state.currentOperand !==""){
                this.state.currentOperand=parseFloat(this.state.currentOperand).toFixed(2);
                this.DisplayInstance.renderDisplay(this.state.currentOperand,""); 
                this.state.isResultDisplayed= false;
            }
        break;

        case "zero/no decimals":
            if(this.state.currentOperand==="") return;
            if(this.state.currentOperand !==""){
                this.state.currentOperand=parseFloat(this.state.currentOperand).toFixed(0);
                this.DisplayInstance.renderDisplay(this.state.currentOperand,""); 
                this.state.isResultDisplayed= false;
            }            

        break;

        case "percentage":
           if(this.state.currentOperand==="" || this.state.previousOperand==="" || this.state.operation==="" ||this.state.operation===undefined) return;
            this.state.percentageType=this.state.operation;
            this.math=`${this.state.previousOperand} ${this.state.operation} ${this.state.currentOperand} % `;
            this.result=this.percentageFunction(this.state.percentageType,this.state.previousOperand,this.state.currentOperand);
            this.DisplayInstance.renderDisplay(this.math,this.result);

            this.updateMemory();
            //resetting state
            this.state.currentOperand=this.result;
            this.previousOperand="";
            this.state.isResultDisplayed=true;
            this.state.operation="";
            this.state.percentageType="";
            this.state.currentOperandIsPercentageValue=true;
        break;
/////////////////////// non math operations ///////////////////////////////////////////////////////
     case "delete":   
                if (this.state.operation !== "" && this.state.previousOperand!=="" && this.state.currentOperand==="") {
                    this.state.operation ="";
                }else if((this.state.operation !== "" && this.state.currentOperand!== "" && this.state.previousOperand!== "")||(this.state.operation === "" && this.state.currentOperand!=="" && this.state.previousOperand==="")){
                    this.state.currentOperand = this.state.currentOperand.slice(0, -1);                                                       
                }else   if(this.state.operation === "" && this.state.currentOperand ==="" && this.state.previousOperand!=="" )  {
                     this.state.previousOperand = this.state.previousOperand.slice(0, -1);                                         
                 }     
                 
                this.DisplayInstance.renderDisplay(
                        `${this.state.previousOperand.toLocaleString()} ${this.state.operation} ${this.state.currentOperand.toLocaleString()}`, 
                        ""
                );                        
    break;

    case "memory clear":
                this.state.memoryValue = ""; // Clear the memory value
                //MC doesn't change the display, so no display update needed.
                console.log("Memory Cleared (MC). Value is now: " + this.state.memoryValue);
                break;

    case "memory recall":
                if (this.state.memoryValue === "") return; // Nothing to recall
                this.state.currentOperand = this.state.memoryValue.toString();
                this.state.isResultDisplayed = false;         
                this.DisplayInstance.renderDisplay(
                    `${this.state.previousOperand.toLocaleString()} ${this.state.operation} ${this.state.currentOperand.toLocaleString()}`,
                    ""
                );
                console.log("Memory Recalled (MR): " + this.state.memoryValue);
                break;

    case "memory store": // Assuming a generic 'MS' button to store the display value
                // Use the currently displayed number for storage
                const valueToStore=parseFloat(document.getElementById("result").textContent);
                this.state.memoryValue = valueToStore;
                console.log("Memory Stored (MS). Value: " + this.state.memoryValue);
    break;

    case "memory minus":
        //current number minus memory number
                // Get the current number from the display/state

                let minusValue = parseFloat(this.state.memoryValue);              
                let currentMemoryMinus = parseFloat(this.state.memoryValue || "0"); // Start with 0 if memory is empty  
                this.state.previousOperand=this.state.currentOperand;
                this.state.operation="-"; 
                this.state.currentOperand=currentMemoryMinus                                      
                this.math= this.mathDisplay(); 
                this.result=this.calculateFunction(parseFloat(this.state.previousOperand),
                                parseFloat(this.state.currentOperand),
                                this.state.operation
                )

                    this.state.memoryValue = this.result;
                    this.DisplayInstance.renderDisplay(this.math,this.result);
                    console.log("Memory Minus (M-). New Memory Value: " + this.state.memoryValue);

    break;

    case "memory plus":
        //current number plus memory number
        // Get the current number from the display/state

                let plusValue = parseFloat(this.state.memoryValue);              
                let currentMemoryPlus = parseFloat(this.state.memoryValue || "0"); // Start with 0 if memory is empty  
                this.state.previousOperand=this.state.currentOperand;
                this.state.operation="+"; 
                this.state.currentOperand=currentMemoryPlus;                                    
                this.math= this.mathDisplay(); 
                this.result=this.calculateFunction(parseFloat(this.state.previousOperand),
                                parseFloat(this.state.currentOperand),
                                this.state.operation
                )

                    this.state.memoryValue = this.result;
                    this.DisplayInstance.renderDisplay(this.math,this.result);
                    console.log("Memory Plus (M+). New Memory Value: " + this.state.memoryValue);
    break;
                
            
    case "prev":
            this.retrievePrevCalculation();
            console.log(this.state.resultsInMemory);
    break;

    case  "next":
            this.retrieveNextCalculation();
            console.log(this.state.resultsInMemory);            
    break;     

        }
    }
 mathDisplay(){
    return `${this.state.previousOperand} ${this.state.operation} ${this.state.currentOperand}`; 
}   
}

//---------------------------------------------initializing  the calculator-----------------------------//
function initializeCalculator(){
    const allButtons=document.querySelectorAll(".button");
    allButtons.forEach(button=>{

        button.addEventListener("click",e=>{
                const buttonClick= new HandleButtonClicks(button,calculatorState,displays,calculate,percentageMathHandler);
                buttonClick.updateState();
                //console.log(calculatorState)
        });
    });
}//on content loaded
initializeCalculator()
//---------------------------------------------initializing  the calculator-----------------------------//
const fruits = "12345";
console.log(fruits.slice(0,-1),fruits.slice(0,-1),fruits.slice(0,-1))