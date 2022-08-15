import Cursor from './Cursor';
import Renderer from './Renderer';

export enum ValueType {
    NUMBER,
    STRING,
    RULE,
    VOID,
}

export type Value = [number, ValueType.NUMBER] | [string, ValueType.STRING] | [Rule, ValueType.RULE] | [void, ValueType.VOID];

export type Rule = [string, Value[]?][];

export type State = {
    scope: Scope;
    cursor: Cursor;
    renderer: Renderer;
};

export type Scope = Map<string, Value>;