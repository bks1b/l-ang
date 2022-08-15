import { Canvas } from 'canvas';
import { MainDict } from '../parser';
import { Expr, TokenType } from '../parser/expr';
import Cursor from './Cursor';
import { functions } from './functions';
import Renderer from './Renderer';
import { Rule, Scope, State, Value, ValueType } from './types';

const evalFn = (key: string, args: Value[], state: State) => {
    const fn = functions[key];
    if (!fn) throw `Unknown function "${key}".`;
    if (fn[1] !== true) {
        if (Array.isArray(fn[1])) {
            const optIndex = fn[1].findIndex(x => Array.isArray(x));
            if (args.length !== (optIndex === -1 ? fn[1].length : optIndex)) throw `Invalid argument length ${args.length}.`;
        }
        if (args.some((x, i) => x[1] !== (Array.isArray(fn[1]) ? Array.isArray(fn[1][i]) ? (<[ValueType]>fn[1][i])[0] : fn[1][i] : fn[1]))) throw 'Invalid argument types.';
    }
    return fn[0](args, state);
};

const getMatch = (rule: Rule[number], arr: [Expr, Expr[]][]) => {
    const match = arr.find(x => x[0].some(x => x[0][0] === rule[0] && x[1]?.length === rule[1]?.length));
    return match && <const>[match[1]!, match[0][0][1] ? new Map(match[0][0][1].map((x, i) => [x[0][0][0], rule[1]![i]])) : undefined];
};

const interpret = (parts: Expr, state: State, localScope?: Scope): Value => {
    const arr = parts.map(x => interpretExpr(x, state, localScope));
    if (arr.length > 1) {
        if (arr.every(x => x?.[1] === ValueType.RULE)) return [arr.flatMap(x => <Rule>x![0]), ValueType.RULE];
        throw 'Cannot concatenate types.';
    }
    return arr[0];
};

const interpretExpr = (x: Expr[number], state: State, localScope?: Scope): Value => {
    if (x[1]) {
        const args = x[1].map(x => interpret(x, state, localScope));
        if (x[0][1] === TokenType.RULE) return [[[x[0][0], args]], ValueType.RULE];
        if (x[0][1] === TokenType.IDENTIFIER) return evalFn(x[0][0], args, state) || [undefined, ValueType.VOID];
        throw 'Uncallable expression.';
    }
    switch (x[0][1]) {
    case TokenType.RULE: return [[[x[0][0]]], ValueType.RULE];
    case TokenType.COLOR: return [x[0][0], ValueType.STRING];
    case TokenType.NUMBER: return [+x[0][0], ValueType.NUMBER];
    case TokenType.IDENTIFIER:
        if (!state.scope.has(x[0][0]) && !localScope?.has(x[0][0])) throw `"${x[0][0]}" is not defined.`;
        return localScope?.get(x[0][0]) || state.scope.get(x[0][0])!;
    }
    throw 'Unexpected expression.';
};

export default (obj: MainDict, canvas: Canvas) => {
    if (!obj.axiom) throw 'Axiom expected.';
    if (!obj.operations) throw 'Operations expected.';
    const state: State = {
        scope: new Map(),
        cursor: new Cursor(),
        renderer: new Renderer(),
    };
    if (obj.config) for (const [key, val] of obj.config) state.scope.set(key[0][0][0], interpret(val[0], state));
    if (obj.init) obj.init.map(x => interpret(x, state));
    const axiom = <[Rule, ValueType]>interpret(obj.axiom[0], state);
    if (axiom[1] !== ValueType.RULE) throw 'Invalid axiom.';
    if (obj.rules) {
        if (!obj.iterations) throw 'Iteration count expected.';
        const [iter, iterType] = interpret(obj.iterations[0], state);
        if (iterType !== ValueType.NUMBER) throw 'Invalid iteration count.';
        for (let n = 0; n < iter; n++) axiom[0] = axiom[0].flatMap(rule => {
            const match = getMatch(rule, obj.rules);
            if (!match) return [rule];
            const res = interpret(match[0][0], state, match[1]);
            if (res[1] !== ValueType.RULE) throw 'Invalid rule type.';
            return res[0];
        });
    }
    for (const rule of axiom[0]) {
        const match = getMatch(rule, obj.operations);
        if (!match) continue;
        match[0].map(x => interpret(x, state, match[1]));
    }
    state.renderer.render(canvas);
    return axiom;
};