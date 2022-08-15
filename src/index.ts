import { Canvas } from 'canvas';
import interpret from './interpreter';
import parse from './parser';

export default (str: string, canvas: Canvas) => interpret(parse(str), canvas);