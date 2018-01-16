import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { ToastyConfig } from 'ng2-toasty';
import { ToastyServiceInt } from "../../util/toasty.service";

@Injectable()
export class XmlUploadService {
    
    constructor(private db: AngularFireDatabase, private toastyService: ToastyServiceInt, private toastyConfig: ToastyConfig) {
        this.toastyConfig.theme = 'material';
    }

    uploadPeriod(val, setPeriod): any {
        var period = val.$.period;
        if (period) {
            delete val.$;
            var jsonStr = JSON.stringify(val);
            var jsonStrRep = jsonStr.replace(/\$/g , 'item');
            var jsonObj = JSON.parse(jsonStrRep);
            this.db.list('/periods').update(period, jsonObj).then(resolve => {
                var currPeriod = Number(period) + 1;
                this.db.object('/').update({currentPeriod: currPeriod});
                this.toastyService.setToastyDefaultSuccess('Erfolgreich!','Die Daten wurden erfolgreich hochgeladen');
            }, reject => {
                this.toastyService.setToastyDefaultError('Fehler!', 'Fehler beim Hochladen der Daten',);
            })
        } else {
          this.toastyService.setToastyDefaultError('Fehler!', 'Fehler beim Hochladen der Daten',);
        }
    }
}
