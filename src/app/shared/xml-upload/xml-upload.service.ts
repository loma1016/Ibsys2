import { AngularFireDatabase } from 'angularfire2/database';
import { Inject, Injectable } from '@angular/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Injectable()
export class XmlUploadService {
    group = 11;
    toastOptions: ToastOptions = {
        title: 'Erfolgreich!',
        msg: 'Die Daten wurden erfolgreich hochgeladen',
        timeout: 3000,
        theme: 'material'
    }

    toastOptionsError:ToastOptions = {
        title: 'Fehler!',
        msg: 'Fehler beim Hochladen der Daten',
        timeout: 3000,
        theme: 'material'
    }

    constructor(private db: AngularFireDatabase, private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
        this.toastyConfig.theme = 'material';
    }

    uploadPeriod(val, setPeriod): any {
        var period = val.$.period;
        var group = val.$.group;
        if (period && group == this.group) {
            delete val.$;
            var jsonStr = JSON.stringify(val);
            var jsonStrRep = jsonStr.replace(/\$/g , 'item');
            var jsonObj = JSON.parse(jsonStrRep);
            this.db.list('/periods').update(period, jsonObj).then(resolve => {
                var currPeriod = Number(period) + 1;
                this.db.object('/').update({currentPeriod: currPeriod});        
                this.toastyService.success(this.toastOptions);
            }, reject => {
                this.toastyService.error(this.toastOptionsError);
            })
        } else {
            this.toastyService.error(this.toastOptionsError);
        }
    }
}
