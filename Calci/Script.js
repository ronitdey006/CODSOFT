var currentInput = "";
var justCalculated = false;

function appendToDisplay(value) {
    var resultDiv = document.getElementById("result");
    var expressionDiv = document.getElementById("expression");

    if (justCalculated == true) {
        if (value == "+" || value == "-" || value == "*" || value == "/" || value == "%") {
            currentInput = resultDiv.innerText;
        } else {
            currentInput = "";
            expressionDiv.innerText = "";
        }
        justCalculated = false;
    }

    if (value == ".") {
        var parts = currentInput.split(/[\+\-\*\/]/);
        var lastPart = parts[parts.length - 1];
        if (lastPart.includes(".")) {
            return;
        }
    }

    var operators = ["+", "-", "*", "/", "%"];
    var lastChar = currentInput[currentInput.length - 1];
    if (operators.includes(value) && operators.includes(lastChar)) {
        currentInput = currentInput.slice(0, -1);
    }

    currentInput = currentInput + value;
    expressionDiv.innerText = currentInput;
    resultDiv.innerText = currentInput;
}

function calculate() {
    var resultDiv = document.getElementById("result");
    var expressionDiv = document.getElementById("expression");

    if (currentInput == "") {
        return;
    }

    try {
        var answer = eval(currentInput);

        if (answer == undefined || isNaN(answer)) {
            resultDiv.innerText = "Error";
            return;
        }

        if (answer % 1 !== 0) {
            answer = parseFloat(answer.toFixed(8));
        }

        expressionDiv.innerText = currentInput + " =";
        resultDiv.innerText = answer;
        currentInput = answer.toString();
        justCalculated = true;

    } catch (error) {
        resultDiv.innerText = "Error";
        expressionDiv.innerText = "";
        currentInput = "";
    }
}

function clearAll() {
    currentInput = "";
    justCalculated = false;
    document.getElementById("result").innerText = "0";
    document.getElementById("expression").innerText = "";
}

function deleteLast() {
    if (justCalculated == true) {
        clearAll();
        return;
    }

    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        var resultDiv = document.getElementById("result");
        var expressionDiv = document.getElementById("expression");
        expressionDiv.innerText = currentInput;
        if (currentInput == "") {
            resultDiv.innerText = "0";
        } else {
            resultDiv.innerText = currentInput;
        }
    }
}

document.addEventListener("keydown", function(event) {
    var key = event.key;
    if (key >= "0" && key <= "9") {
        appendToDisplay(key);
    } else if (key == "+") {
        appendToDisplay("+");
    } else if (key == "-") {
        appendToDisplay("-");
    } else if (key == "*") {
        appendToDisplay("*");
    } else if (key == "/") {
        event.preventDefault();
        appendToDisplay("/");
    } else if (key == "%") {
        appendToDisplay("%");
    } else if (key == ".") {
        appendToDisplay(".");
    } else if (key == "Enter" || key == "=") {
        calculate();
    } else if (key == "Backspace") {
        deleteLast();
    } else if (key == "Escape") {
        clearAll();
    }
});