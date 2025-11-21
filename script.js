

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
        case "xy": return mathOperation.raiseToPower();
        case "√x": return mathOperation.squareRoot();
        default: throw new error("Error: Invalid operator");
    }
}


//let maths=new arithmeticOperations(3,4);

//console.log(maths.add(),maths.subtract(),maths.multiply(),maths.divide());
console.log(calculate(9,2,"√x"))