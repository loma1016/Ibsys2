import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-xml-upload',
  templateUrl: './xml-upload.component.html',
  styleUrls: ['./xml-upload.component.css']
})
export class XmlUploadComponent {

  constructor(private db: AngularFireDatabase) {
  }
  
  changeListener($event) : void {
    let input = $event.target.files[0];

    let reader = new FileReader();
    reader.onload = this.blabla.bind(this);
    reader.readAsText(input);
  }

  blabla(e) {
    let parseString = require('xml2js').parseString;    
    var reader = e.target;
    var result = reader.result;

    var resultJson = new Promise(function(resolve, reject) {
      parseString(result, function (err, res) {  
        if (!err) {
            resolve(res.results);
        } else {
            reject(err);
        }
      })
    });

    resultJson.then(val => {  
      debugger
      this.db.list('period').push(JSON.stringify(val));
    }); 
  }
}