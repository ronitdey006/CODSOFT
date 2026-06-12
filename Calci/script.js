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
        var expression = currentInput.replace(/(\d+\.?\d*)%/g, function(match, num) {
            return String(parseFloat(num) / 100);
        });
        var answer = parseExpression(expression);
        if (answer === null || isNaN(answer) || !isFinite(answer)) {
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
    } catch (e) {
        resultDiv.innerText = "Error";
        expressionDiv.innerText = "";
        currentInput = "";
    }
}

var pos = 0;
var inputStr = "";

function parseExpression(str) {
    inputStr = str.replace(/\s/g, "");
    pos = 0;
    var result = parseAddSub();
    return result;
}

function parseAddSub() {
    var left = parseMulDiv();
    while (pos < inputStr.length && (inputStr[pos] == "+" || inputStr[pos] == "-")) {
        var op = inputStr[pos];
        pos++;
        var right = parseMulDiv();
        if (op == "+") {
            left = left + right;
        } else {
            left = left - right;
        }
    }
    return left;
}

function parseMulDiv() {
    var left = parseNumber();
    while (pos < inputStr.length && (inputStr[pos] == "*" || inputStr[pos] == "/")) {
        var op = inputStr[pos];
        pos++;
        var right = parseNumber();
        if (op == "*") {
            left = left * right;
        } else {
            if (right == 0) return NaN;
            left = left / right;
        }
    }
    return left;
}

function parseNumber() {
    var start = pos;
    if (inputStr[pos] == "-") {
        pos++;
    }
    while (pos < inputStr.length && (
        (inputStr[pos] >= "0" && inputStr[pos] <= "9") || inputStr[pos] == "."
    )) {
        pos++;
    }
    var numStr = inputStr.slice(start, pos);
    return parseFloat(numStr);
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
