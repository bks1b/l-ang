export enum TokenType {
    OPERATOR,
    IDENTIFIER,
    NUMBER,
    COLOR,
    RULE,
}

const tokenTypes = <[RegExp | string[], TokenType][]>[
    [['(', ')', ','], TokenType.OPERATOR],
    [['black', 'silver', 'gray', 'white', 'maroon', 'red', 'purple', 'fuchsia', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'teal', 'aqua'], TokenType.COLOR],
    [/^[a-z_]+/, TokenType.IDENTIFIER],
    [/^-?\d+(\.\d+)?/, TokenType.NUMBER],
    [/^#([a-f0-9]{6}|[a-f0-9]{3})/, TokenType.COLOR],
    [/^[A-Z[\]+-{}]/, TokenType.RULE],
];

const tokenize = (str: string) => {
    const arr: Token[] = [];
    for (let i = 0; i < str.length; i++) {
        if (!str[i].trim()) continue;
        const match = tokenTypes
            .map(x => <Token>[
                (Array.isArray(x[0])
                    ? x[0].find(x => str.slice(i).startsWith(x))
                    : str.slice(i).match(x[0])?.[0])!,
                x[1],
            ])
            .find(x => x[0]);
        if (match) {
            arr.push(match);
            i += match[0].length - 1;
            continue;
        }
        throw `Unexpected token "${str[i]}".`;
    }
    return arr;
};

const parse = (tokens: Token[]) => {
    const arr: Expr = [];
    main: for (let i = 0; i < tokens.length; i++) {
        if (tokens[i + 1]?.[0] === '(') {
            if (![TokenType.IDENTIFIER, TokenType.RULE].includes(tokens[i][1])) throw 'Uncallable expression.';
            let depth = 1;
            const args = [i + 1];
            for (let j = i + 2; j < tokens.length; j++) {
                if (tokens[j][0] === ',' && depth === 1) args.push(j);
                if (tokens[j][0] === '(') depth++;
                if (tokens[j][0] === ')' && !--depth) {
                    args.push(j);
                    arr.push([tokens[i], args.slice(1).filter((x, i) => args[i] + 1 !== x).map((x, i) => parse(tokens.slice(args[i] + 1, x)))]);
                    i = j;
                    continue main;
                }
            }
            throw 'Closing ")" expected.';
        }
        if (tokens[i][0] === ')') throw 'Unexpected token ")".';
        arr.push([tokens[i]]);
    }
    return arr;
};

export const parsePattern = (parts: Expr) => {
    const cases: Expr = [];
    let lastI = 0;
    for (let i = 0; i <= parts.length; i++) {
        if (i === parts.length || parts[i][0][0] === ',') {
            if (i - lastI > 1) throw 'Arguments must consist of a single rule.';
            cases.push(parts[lastI]);
            lastI = i + 1;
        }
    }
    if (cases.some(x => x[1] && x[1].some(x => x[0][0][1] !== TokenType.IDENTIFIER))) throw 'Arguments must be identifiers.';
    if (cases.some(x => x[1]) && cases.slice(1).some(x => JSON.stringify(x[1]) !== JSON.stringify(cases[0][1]))) throw 'Inconsistent case arguments.';
    return cases;
};

export default (x: string) => parse(tokenize(x));

type Token = [string, TokenType];
export type Expr = [Token, Expr[]?][];