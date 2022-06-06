import { OysterCard } from './oyster-card';
import { FareService } from './oyster-fare.service';
import { Transport, StationType, Zone, Fares, CardPunchStatus } from './oyster.models';

export class OysterService {
    private static _appInstance: OysterService;
    private _fareService: FareService;
    private constructor() {
        this._fareService = FareService.Instance;
    }
    public static get Instance() {
        return this._appInstance || (this._appInstance = new this());
    }

    /* Check if station occurs in multiple zones or not */
    private _hasMultipleZones(sourceZone: Zone | Zone[], destZone: Zone | Zone[]) {
        if (Array.isArray(sourceZone) || Array.isArray(destZone)) {
            return true;
        }
        return false;
    }

    /* Getting all travelled zone list for a trip */
    private _flattenAndUniqueZoneList(sourceZone: Zone | Zone[], destZone: Zone | Zone[]) {
        let zoneList;
        if (Array.isArray(destZone)) {
            zoneList = destZone.concat(sourceZone);
        } else if (Array.isArray(sourceZone)) {
            zoneList = sourceZone.concat(destZone);
        } else {
            zoneList = [sourceZone, destZone];
        }

        const uniqueZoneList = zoneList.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });

        return uniqueZoneList;
    }

    public checkInBarrier(oysterCard: OysterCard, sourceStation: StationType, transport: Transport) {
        const journeyStartPrice = this._fareService.getMaxFare(transport);

        if (!oysterCard.checkBalance(journeyStartPrice)) {
            oysterCard.currentStatus = CardPunchStatus.None;
            console.log('Oops! Card does not have sufficient balance, please recharge');
            return;
        }

        oysterCard.currentStatus = CardPunchStatus.CheckIn;
        oysterCard.sourceStation = sourceStation;

        const remainingBalance = oysterCard.debitBalance(journeyStartPrice);

        console.log(`Journey Start: £${journeyStartPrice}`);
    }

    public checkOutBarrier(oysterCard: OysterCard, destinationStation: StationType, transport: Transport) {
        if (oysterCard.currentStatus !== CardPunchStatus.CheckIn) {
            console.log('Invalid passage, please contact to customer support.');
            return;
        }

        const sourceStationZone = oysterCard.sourceStation.zone;
        const destStationZone = destinationStation.zone;
        let exactJourneyPrice = 0;

        if (transport === Transport.Tube) {
            if (sourceStationZone === destStationZone && destStationZone === Zone.ZONE1) {
                exactJourneyPrice = Fares.AnywhereInZone1;
            }

            if (!this._hasMultipleZones(sourceStationZone, destStationZone) && destStationZone !== Zone.ZONE1 && sourceStationZone === destStationZone) {
                exactJourneyPrice = Fares.AnyoneZoneOutsideZone1;
            }

            const uniqueZoneList = this._flattenAndUniqueZoneList(sourceStationZone, destStationZone);

            if (uniqueZoneList.length === 2 && uniqueZoneList.indexOf(Zone.ZONE1) > -1) {
                if (this._hasMultipleZones(sourceStationZone, destStationZone)) {
                    exactJourneyPrice = Fares.SpecialZoneFare;
                } else {
                    exactJourneyPrice = Fares.AnyTwoZonesIncZone1;
                }
            }

            if (uniqueZoneList.length === 2 && uniqueZoneList.indexOf(Zone.ZONE1) === -1) {
                exactJourneyPrice = Fares.AnyTwoZonesExcZone1;
            }

            if (uniqueZoneList.length === 3) {
                exactJourneyPrice = Fares.AnyThreeZone;
            }

            if (oysterCard.lastDebittedAmount > exactJourneyPrice) {
                const overChargedAmount = oysterCard.lastDebittedAmount - exactJourneyPrice;
                oysterCard.creditBalance(overChargedAmount);
            }

            oysterCard.currentStatus = CardPunchStatus.CheckOut;

            oysterCard.resetCardBackup();
        }
        console.log(`Journey End: £${exactJourneyPrice}`);
        console.log('=============================');
        console.log(`Remaining balance: £${oysterCard.getBalanceAmountInfo()}`);
        console.log('=============================');
        console.log('');

        oysterCard.currentStatus = CardPunchStatus.CheckOut;
    }
}
