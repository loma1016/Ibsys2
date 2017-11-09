import { AngularFireDatabase } from 'angularfire2/database';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class XmlUploadService {
    group = 11;

    constructor(private db: AngularFireDatabase) {
    }

    uploadPeriod(val) {  
        var period = val.$.period;
        var group = val.$.group;
        if (period && group == this.group) {
            delete val.$;
            var jsonStr = JSON.stringify(val);
            var jsonStrRep = jsonStr.replace(/\$/g , "@");
            var jsonObj = JSON.parse(jsonStrRep);
            this.db.list('/periods').update(period, jsonObj);
        } 
    }
}