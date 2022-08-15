export const cursorKeys = <const>['x', 'y', 'rotation'];

export default class {
    public x = 0;
    public y = 0;
    public rotation = 0;
    private stack: Record<typeof cursorKeys[number], number[]> = {
        x: [],
        y: [],
        rotation: [],
    };

    getPoint(r: number) {
        return [this.x + r * Math.cos(this.rotation), this.y + r * Math.sin(this.rotation)];
    }

    push(k: CursorKey) {
        this.stack[k].push(this[k]);
    }

    pop(k: CursorKey) {
        if (!this.stack[k].length) throw `The "${k}" stack is empty.`;
        this[k] = this.stack[k].pop()!;
    }
}

type CursorKey = typeof cursorKeys[number];