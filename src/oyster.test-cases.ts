import { Stations, Transport } from './oyster.models';
import { OysterService } from './oyster.service';
import { OysterCard } from './oyster-card';

export class TestCases {
    private _oysterService: OysterService;
    private _oysterCard: OysterCard;
    constructor(oysterService: OysterService, userOysterCard: OysterCard) {
        this._oysterService = oysterService;
        this._oysterCard = userOysterCard;
    }
    firstUseCase() {
        this._oysterService.checkInBarrier(this._oysterCard, Stations.HOL, Transport.Tube);
        this._oysterService.checkOutBarrier(this._oysterCard, Stations.ECT, Transport.Tube);

        this._oysterService.checkInBarrier(this._oysterCard, Stations.WDN, Transport.Bus);
        this._oysterService.checkOutBarrier(this._oysterCard, Stations.ECT, Transport.Bus);

        this._oysterService.checkInBarrier(this._oysterCard, Stations.ECT, Transport.Tube);
        this._oysterService.checkOutBarrier(this._oysterCard, Stations.HMT, Transport.Tube);
    }

    secondUseCase() {
        this._oysterService.checkInBarrier(this._oysterCard, Stations.HMT, Transport.Tube);
        this._oysterService.checkOutBarrier(this._oysterCard, Stations.HMT, Transport.Tube);
    }

    thirdUseCase() {
        this._oysterService.checkInBarrier(this._oysterCard, Stations.HMT, Transport.Tube);
        this._oysterService.checkOutBarrier(this._oysterCard, Stations.WDN, Transport.Tube);
    }

    fourthUseCase() {
        this._oysterService.checkOutBarrier(this._oysterCard, Stations.HMT, Transport.Tube);
    }
}
