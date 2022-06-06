import { CardPunchStatus } from './oyster.models';

export class OysterCard {
    // card identity number
    private _id: number;

    // card balance amount
    private _balanceAmount: number = 0;
    private _lastDebitedAmount: number = 0;
    public currentStatus = CardPunchStatus.None;
    public sourceStation: any;
    public destinationStation: any;

    constructor(initialAmount = 30) {
        this._id = this._generateCardNumber();
        this._balanceAmount = initialAmount;
    }

    private _generateCardNumber(): number {
        return Math.floor(Math.random() * 1000000) + 1;
    }

    public creditBalance(amount: number) {
        this._balanceAmount += amount;
    }

    public debitBalance(amount: number) {
        this._lastDebitedAmount = amount;
        return this.checkBalance(amount) ? (this._balanceAmount -= amount) : this._balanceAmount;
    }

    public getBalanceAmountInfo(): number {
        return this._balanceAmount;
    }

    public checkBalance(amount: number) {
        return this._balanceAmount - amount >= 0;
    }

    get lastDebittedAmount() {
        return this._lastDebitedAmount;
    }

    public resetCardBackup() {
        this._lastDebitedAmount = 0;
        this.currentStatus = CardPunchStatus.None;
        this.sourceStation = null;
    }
}
