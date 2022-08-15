import parseExpr, { Expr, parsePattern } from './expr';

const resolveFunction = (f: Transform): (x: string) => Expr => typeof f === 'function' ? x => f(parseExpr(x)) : x => parseExpr(x);

const parse = (lines: string[], { entries, keys }: {
    keys?: Record<string, {
        raw?: Transform;
        entries?: Transform[];
        singleLine?: boolean;
    }>;
    entries?: Transform[];
}): any => {
    const arr: [string, string[]][] = [];
    main: for (let i = 0; i < lines.length; i++) {
        if (lines[i].endsWith('{')) {
            let depth = 1;
            for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].endsWith('{')) depth++;
                if (lines[j].startsWith('}') && !--depth) {
                    arr.push([lines[i].slice(0, -1).trim(), lines.slice(i + 1, j)]);
                    i = j;
                    continue main;
                }
            }
            throw 'Closing "}" expected.';
        }
        if (lines[i]) {
            const [, key, val] = lines[i].match(/^(.+?):(.+)$/) || [];
            if (!key) throw 'Key-value pair expected.';
            arr.push([key, [val]]);
        }
    }
    return arr.map(([key, val]) => {
        const config = keys?.[key];
        if (keys) {
            if (!config) throw `Unexpected key "${key}".`;
            if (config.singleLine && val.length > 1) throw `Single line key-value pair expected for "${key}".`;
        }
        return config?.entries
            ? [key, parse(val, { entries: config.entries })]
            : config?.raw
                ? [key, val.filter(x => x).map(x => resolveFunction(config.raw!)(x))]
                : [resolveFunction(entries![0])(key), val.map(x => resolveFunction(entries![1])(x))];
    });
};

export default (x: string) => <MainDict>Object.fromEntries(parse(x.replace(/\/\*([\s\S]*?)\*\//gm, '').split('\n').map(x => x.replace(/\/\/.*/, '').trim()), { keys: {
    config: { entries: [true, true] },
    init: { raw: true },
    rules: { entries: [parsePattern, true] },
    operations: { entries: [parsePattern, true] },
    axiom: { singleLine: true, raw: true },
    iterations: { singleLine: true, raw: true },
} }));

type Transform = true | ((x: Expr) => Expr);
export type MainDict = Record<'config' | 'rules' | 'operations', [Expr, Expr[]][]> & Record<'init' | 'axiom' | 'iterations', Expr[]>;