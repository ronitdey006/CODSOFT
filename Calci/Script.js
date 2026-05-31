function safeMath(expression) {
    expression = expression.replace(/(\d+(\.\d+)?)%/g, function(match, num) {
        return "(" + num + "/100)";
    });

    var tokens = [];
    var i = 0;
    var expr = expression.replace(/\s/g, "");

    while (i < expr.length) {
        var ch = expr[i];

        if ((ch >= "0" && ch <= "9") || ch == ".") {
            var num = "";
            while (i < expr.length && ((expr[i] >= "0" && expr[i] <= "9") || expr[i] == ".")) {
                num += expr[i];
                i++;
            }
            tokens.push(parseFloat(num));
            continue;
        }

        if (ch == "-" && (tokens.length == 0 || typeof tokens[tokens.length - 1] == "string")) {
            var num = "-";
            i++;
            while (i < expr.length && ((expr[i] >= "0" && expr[i] <= "9") || expr[i] == ".")) {
                num += expr[i];
                i++;
            }
            tokens.push(parseFloat(num));
            continue;
        }

        if (ch == "+" || ch == "-" || ch == "*" || ch == "/") {
            tokens.push(ch);
            i++;
            continue;
        }

        if (ch == "(") {
            var depth = 1;
            var inner = "";
            i++;
            while (i < expr.length && depth > 0) {
                if (expr[i] == "(") depth++;
                if (expr[i] == ")") depth--;
                if (depth > 0) inner += expr[i];
                i++;
            }
            tokens.push(safeMath(inner));
            continue;
        }

        i++;
    }

    var i2 = 1;
    while (i2 < tokens.length - 1) {
        if (tokens[i2] == "*") {
            var result = tokens[i2 - 1] * tokens[i2 + 1];
            tokens.splice(i2 - 1, 3, result);
        } else if (tokens[i2] == "/") {
            if (tokens[i2 + 1] == 0) return NaN;
            var result = tokens[i2 - 1] / tokens[i2 + 1];
            tokens.splice(i2 - 1, 3, result);
        } else {
            i2 += 2;
        }
    }

    var i3 = 1;
    while (i3 < tokens.length - 1) {
        if (tokens[i3] == "+") {
            var result = tokens[i3 - 1] + tokens[i3 + 1];
            tokens.splice(i3 - 1, 3, result);
        } else if (tokens[i3] == "-") {
            var result = tokens[i3 - 1] - tokens[i3 + 1];
            tokens.splice(i3 - 1, 3, result);
        } else {
            i3 += 2;
        }
    }

    return tokens[0];
}
