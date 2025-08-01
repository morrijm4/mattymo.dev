export type BoxStatus = 'empty' | 'snake' | 'food';

export interface BoxOptions {
    status: BoxStatus;
}
export class Box {
    status: BoxStatus;

    constructor({ status }: BoxOptions) {
        this.status = status;
    }
}
