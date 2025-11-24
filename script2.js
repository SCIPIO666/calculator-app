// Refactored version of your calculator code
// Same logic preserved, but architecture is improved: modular, clean, and separated.

// -------------------- DOM Selectors --------------------
const mathDisplayPanel = document.querySelector("#math");
const resultDisplayPanel = document.querySelector("#result");

// -------------------- State ----------------------------
const calculatorState = {
    currentOperand: "",
    previousOperand: "",
    operation: "",
    isResultDisplayed: false,
    percentageType: "",
    currentOperandIsPercentageValue: false,
    resultsInMemory: [],
    currentMemoryCalculation: "",
};

// -------------------- Display Manager ------------------
class Display {
    constructor(mathDisplayPanel, resultDisplayPanel) {
        this.mathDisplayPanel = mathDisplayPanel;
        this.resultDisplayPanel = resultDisplayPanel;
    }

    clear() {
        this.render("", "");
    }

    render(math, result) {
        this.mathDisplayPanel.textContent = math ?? "";
        this.resultDisplayPanel.textContent = result ?? "";
    }
}

const display = new Display(mathDisplayPanel, resultDisplayPanel);

// -------------------- Arithmetic Operations ------------
class ArithmeticOperations {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    add() { return this.a + this.b; }
    subtract() { return this.a - this.b; }
    multiply() { return this.a * this.b; }
    divide() { return this.b === 0 ? NaN : this.a / this.b; }
    raiseToPower() { return this.a ** this.b; }
    squareRoot() { return this.a ** (1 / this.b); }
}

function calculate(a, b, operator) {
    const m = new ArithmeticOperations(a, b);
    switch (operator) {
        case "+": return m.add();
        case "-": return m.subtract();
        case "x": return m.multiply();
        case "÷": return m.divide();
        case "xʸ": return m.raiseToPower();
        case "√x": return m.squareRoot();
        default: throw new Error("Invalid operator");
    }
}

// -------------------- Percentage Handler ----------------
function percentageMath(type, a, b) {
    a = parseFloat(a);
    b = parseFloat(b);

    const percent = (b / 100) * a;

    switch (type) {
        case "+": return (a + percent).toFixed(1);
        case "-": return (a - percent).toFixed(1);
        case "x": return percent.toFixed(1);
        case "÷": return ((a * 100) / b).toFixed(1);
    }
}

// -------------------- Button Type Checker ---------------
function getButtonType(btn) {
    const classes = btn.classList;

    if (classes.contains("number")) return "number";
    if (classes.contains("operator")) return "operator";
    if (classes.contains("equals")) return "equals";
    if (classes.contains("decimal")) return "decimal";
    if (classes.contains("percentage")) return "percentage";
    if (classes.contains("add")) return "add";
    if (classes.contains("subtract")) return "subtract";
    if (classes.contains("multiply")) return "multiply";
    if (classes.contains("divide")) return "divide";
    if (classes.contains("exponent")) return "exponent";
    if (classes.contains("square-root")) return "square-root";
    if (classes.contains("ac")) return "ac";
    if (classes.contains("positive-negative")) return "positive-negative";
    if (classes.contains("r2-two-decimal")) return "two-dec";
    if (classes.contains("r0-zero-decimal")) return "zero-dec";
    if (classes.contains("prev")) return "prev";
    if (classes.contains("next")) return "next";

    return "unknown";
}

// -------------------- Memory Helpers -------------------
function saveToMemory(state, math, result) {
    state.resultsInMemory.push({
        value1: state.previousOperand,
        operator: state.operation,
        value2: state.currentOperand,
        mathDisplay: math,
        result,
    });
}

function retrieveMemory(state, direction, display) {
    const len = state.resultsInMemory.length;
    if (len === 0) return;

    if (state.currentMemoryCalculation === "") {
        state.currentMemoryCalculation = direction === "prev" ? len - 1 : 0;
    } else {
        const delta = direction === "prev" ? -1 : 1;
        state.currentMemoryCalculation = Math.min(
            len - 1,
            Math.max(0, state.currentMemoryCalculation + delta)
        );
    }

    const item = state.resultsInMemory[state.currentMemoryCalculation];
    display.render(item.mathDisplay, item.result);
}

// -------------------- Button Handler -------------------
class ButtonHandler {
    constructor(button, state, display) {
        this.button = button;
        this.type = getButtonType(button);
        this.state = state;
        this.display = display;
    }

    handle() {
        switch (this.type) {
            case "number":
            case "decimal":
                return this.inputNumber();

            case "add":
            case "subtract":
            case "multiply":
            case "divide":
            case "exponent":
            case "square-root":
            case "operator":
                return this.chooseOperator();

            case "equals":
                return this.evaluate();

            case "percentage":
                return this.handlePercentage();

            case "positive-negative":
                return this.toggleSign();

            case "two-dec": return this.roundTo(2);
            case "zero-dec": return this.roundTo(0);

            case "ac": return this.reset();

            case "prev": return retrieveMemory(this.state, "prev", this.display);
            case "next": return retrieveMemory(this.state, "next", this.display);
        }
    }

    inputNumber() {
        const val = this.button.textContent;

        if (this.type === "decimal" && this.state.currentOperand.includes(".")) return;

        this.state.currentOperand += val;
        this.updateDisplay();
    }

    chooseOperator() {
        if (this.state.currentOperand === "") return;

        if (this.state.previousOperand !== "" && this.state.operation !== "") {
            const res = calculate(
                parseFloat(this.state.previousOperand),
                parseFloat(this.state.currentOperand),
                this.state.operation
            );

            const math = `${this.state.previousOperand} ${this.state.operation} ${this.state.currentOperand}`;
            saveToMemory(this.state, math, res);
            this.display.render(math, res);

            this.state.previousOperand = res;
            this.state.currentOperand = "";
        } else {
            this.state.previousOperand = this.state.currentOperand;
            this.state.currentOperand = "";
        }

        this.state.operation = this.button.textContent;
        this.updateDisplay();
    }

    evaluate() {
        if (!this.state.previousOperand || !this.state.currentOperand || !this.state.operation) return;

        const result = calculate(
            parseFloat(this.state.previousOperand),
            parseFloat(this.state.currentOperand),
            this.state.operation
        );

        const math = `${this.state.previousOperand} ${this.state.operation} ${this.state.currentOperand}`;
        saveToMemory(this.state, math, result);

        this.display.render(math, result);

        this.state.currentOperand = result;
        this.state.previousOperand = "";
        this.state.operation = "";
    }

    handlePercentage() {
        if (!this.state.previousOperand || !this.state.currentOperand || !this.state.operation) return;

        const res = percentageMath(
            this.state.operation,
            this.state.previousOperand,
            this.state.currentOperand
        );

        const math = `${this.state.previousOperand} ${this.state.operation} ${this.state.currentOperand} %`;
        saveToMemory(this.state, math, res);

        this.display.render(math, res);

        this.state.currentOperand = res;
        this.state.operation = "";
    }

    toggleSign() {
        if (!this.state.currentOperand) return;
        this.state.currentOperand = parseFloat(this.state.currentOperand) * -1;
        this.updateDisplay();
    }

    roundTo(n) {
        if (!this.state.currentOperand) return;
        this.state.currentOperand = parseFloat(this.state.currentOperand).toFixed(n);
        this.updateDisplay();
    }

    reset() {
        Object.assign(this.state, {
            currentOperand: "",
            previousOperand: "",
            operation: "",
            isResultDisplayed: false,
            percentageType: "",
            currentOperandIsPercentageValue: false,
        });

        this.display.clear();
    }

    updateDisplay() {
        this.display.render(
            `${this.state.previousOperand} ${this.state.operation} ${this.state.currentOperand}`,
            ""
        );
    }
}

// -------------------- Initialize ------------------------
function initCalculator() {
    document.querySelectorAll(".button").forEach(btn => {
        btn.addEventListener("click", () => {
            new ButtonHandler(btn, calculatorState, display).handle();
        });
    });
}

initCalculator();
