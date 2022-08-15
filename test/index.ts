import { createCanvas } from 'canvas';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import generate from '../src';

try { mkdirSync('test/res'); } catch {}

for (const file of readdirSync('test/programs')) {
    const name = file.split('.')[0];
    const canvas = createCanvas(0, 0);
    const start = Date.now();
    generate(readFileSync(`test/programs/${file}`, 'utf8'), canvas);
    const end = Date.now();
    writeFileSync(`test/res/${name}.png`, canvas.toBuffer());
    console.log(name, end - start, 'ms');
}