import { Canvas } from 'canvas';

export default class {
    private operations: Operation[] = [];
    private bounds: number[][] = [[0, 0], [0, 0]];
    public background = 'white';

    updateCoords(x: number, y: number) {
        this.bounds = (<const>['min', 'max']).map((f, i) => [x, y].map((c, j) => Math[f](c, this.bounds[i][j])));
    }

    config<T extends Config>(k: T, v: CanvasRenderingContext2D[T]) {
        this.operations.push(['set', k, v]);
    }

    line(...[x0, y0, x1, y1]: number[]) {
        this.operations.push(['line', x0, y0, x1, y1]);
        this.updateCoords(x0, y0);
        this.updateCoords(x1, y1);
    }

    circle(type: ColorType, ...[x, y, r]: number[]) {
        this.operations.push(['arc', x, y, r], [type]);
        this.updateCoords(x - r, y - r);
        this.updateCoords(x + r, y + r);
    }

    render(canvas: Canvas) {
        const [[minX, minY], [maxX, maxY]] = this.bounds;
        canvas.width = maxX - minX;
        canvas.height = maxY - minY;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = this.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        let lineStarted = false;
        let lastCoords: number[] | undefined;
        for (const op of this.operations) switch (op[0]) {
        case 'fill':
        case 'stroke':
            if (lineStarted) {
                lineStarted = false;
                lastCoords = undefined;
            }
            ctx[op[0]]();
            break;
        case 'line':
            if (lineStarted && lastCoords![0] === op[1] && lastCoords![1] === op[2]) ctx.lineTo(op[3] - minX, op[4] - minY);
            else {
                if (lineStarted) ctx.stroke();
                lineStarted = true;
                ctx.beginPath();
                ctx.moveTo(op[1] - minX, op[2] - minY);
                ctx.lineTo(op[3] - minX, op[4] - minY);
            }
            lastCoords = [op[3], op[4]];
            break;
        case 'arc':
        case 'set':
            if (lineStarted) {
                lineStarted = false;
                lastCoords = undefined;
                ctx.stroke();
            }
            ctx.beginPath();
            if (op[0] === 'set') ctx[op[1]] = <any>op[2];
            else ctx.arc(op[1] - minX, op[2] - minY, op[3], 0, Math.PI * 2);
            break;
        }
        if (lineStarted) ctx.stroke();
    }
}

type ColorType = 'fill' | 'stroke';
type Config = 'lineWidth' | 'globalAlpha' | 'strokeStyle' | 'fillStyle';
type Operation = ['set', Config, CanvasRenderingContext2D[Config]] | [ColorType] | ['line', number, number, number, number] | ['arc', number, number, number];