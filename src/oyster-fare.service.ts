import { Fares, Transport } from './oyster.models';

export class FareService {
    private static _fareServiceInstance: FareService;
    private _maxTubeFare: number = 0;
    private _maxBusFare = Fares.BusFare;

    private constructor() {}

    public static get Instance() {
        return this._fareServiceInstance || (this._fareServiceInstance = new this());
    }

    getMaxFare(transport: Transport) {
        if (transport === Transport.Bus) {
            return this._maxBusFare;
        }

        if (!this._maxTubeFare) {
            const fares = Object.keys(Fares)
                .filter((k) => typeof Fares[k as any] === 'string')
                .sort();

            this._maxTubeFare = parseFloat(fares[fares.length - 1]);
        }

        return this._maxTubeFare;
    }
}
