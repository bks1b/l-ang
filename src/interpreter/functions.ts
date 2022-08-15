import { cursorKeys } from './Cursor';
import { Rule, State, Value, ValueType } from './types';

const degToRad = (x: Value[]) => +x[0][0] / 180 * Math.PI;

export const functions: Record<string, HelperFn> = {
    rgb: [arr => [`rgb(${arr.map(x => Math.round(+x[0])).join(',')})`, ValueType.STRING], [ValueType.NUMBER, ValueType.NUMBER, ValueType.NUMBER]],
    stroke_color: [(arr, state) => state.renderer.config('strokeStyle', <string>arr[0][0]), [ValueType.STRING]],
    fill_color: [(arr, state) => state.renderer.config('fillStyle', <string>arr[0][0]), [ValueType.STRING]],
    line_width: [(arr, state) => state.renderer.config('lineWidth', +arr[0][0]), [ValueType.NUMBER]],
    opacity: [(arr, state) => state.renderer.config('globalAlpha', +arr[0][0]), [ValueType.NUMBER]],
    repeat: [arr => [Array.from({ length: +arr[1][0] }, () => <Rule>arr[0][0]).flat(), ValueType.RULE], [ValueType.RULE, ValueType.NUMBER]],
    ...Object.fromEntries((<[string, (...x: number[]) => number][]>[
        ['add', (x, y) => x + y],
        ['subtract', (x, y) => x - y],
        ['multiply', (x, y) => x * y],
        ['divide', (x, y) => x / y],
        ['pow', (x, y) => x ** y],
        ['root', (x, y) => x ** (1 / y)],
        ['log', (x, y) => Math.log(x) / Math.log(y)],
        ['mod', (x, y) => x % y],
    ]).map(x => [x[0], [arr => [x[1](+arr[0][0], +arr[1][0]), ValueType.NUMBER], [ValueType.NUMBER, ValueType.NUMBER]]])),
    ...Object.fromEntries((<const>['floor', 'ceil', 'round', 'abs']).map(f => [f, [arr => [Math[f](+arr[0][0]), ValueType.NUMBER], [ValueType.NUMBER]]])),
    ...Object.fromEntries((<const>['sin', 'cos', 'tan']).map(f => [f, [arr => [Math[f](degToRad(arr)), ValueType.NUMBER], [ValueType.NUMBER]]])),
    ...Object.fromEntries((<const>['min', 'max']).map(f => [f, [arr => Math[f](...arr.map(x => +x[0])), ValueType.NUMBER], ValueType.NUMBER])),
    set_rotation: [(arr, state) => void (state.cursor.rotation = degToRad(arr)), [ValueType.NUMBER]],
    rotate: [(arr, state) => void (state.cursor.rotation += degToRad(arr)), [ValueType.NUMBER]],
    rotate_counter: [(arr, state) => void (state.cursor.rotation -= degToRad(arr)), [ValueType.NUMBER]],
    move: [(arr, state) => void ([state.cursor.x, state.cursor.y] = state.cursor.getPoint(+arr[0][0])), [ValueType.NUMBER]],
    move_to: [(arr, state) => void ([state.cursor.x, state.cursor.y] = arr.map(x => +x[0])), [ValueType.NUMBER, ValueType.NUMBER]],
    line: [
        (arr, state) => {
            const [x, y] = state.cursor.getPoint(+arr[0][0]);
            state.renderer.line(state.cursor.x, state.cursor.y, state.cursor.x = x, state.cursor.y = y);
        },
        [ValueType.NUMBER],
    ],
    line_to: [
        (arr, state) => {
            const [x, y] = arr.map(x => +x[0]);
            state.renderer.line(state.cursor.x, state.cursor.y, state.cursor.x = x, state.cursor.y = y);
        },
        [ValueType.NUMBER, ValueType.NUMBER],
    ],
    ...Object.fromEntries((<const>['fill', 'stroke']).map(t => [t + '_circle', [(arr, state) => state.renderer.circle(t, state.cursor.x, state.cursor.y, +arr[0][0]), [ValueType.NUMBER]]])),
    background: [(arr, state) => void (state.renderer.background = <string>arr[0][0]), [ValueType.STRING]],
    random_num: [arr => [+arr[0][0] + Math.random() * (+arr[1][0] - +arr[0][0]), ValueType.NUMBER], [ValueType.NUMBER, ValueType.NUMBER]],
    random: [arr => arr[~~(Math.random() * arr.length)], true],
    neg: [arr => [-arr[0][0], ValueType.NUMBER], [ValueType.NUMBER]],
    ...Object.fromEntries((<const>['push', 'pop']).flatMap(f => [
        [f, [(_, state) => cursorKeys.forEach(x => state.cursor[f](x)), []]],
        ...cursorKeys.map(k => [`${f}_${k}`, <HelperFn>[(_, state) => state.cursor[f](k), []]]),
    ])),
};

type HelperFn = [(args: Value[], state: State) => Value | void, true | ValueType | (ValueType | [ValueType])[]];