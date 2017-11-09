import { Component } from '@angular/core';
import { XmlUploadService } from '../shared/xml-upload/xml-upload.service';


@Component({
  selector: 'app-xml-upload',
  templateUrl: './xml-upload.component.html',
  styleUrls: ['./xml-upload.component.css']
})
export class XmlUploadComponent {

  constructor(private xmlUploadService: XmlUploadService) {
  }

  changeListener($event) : void {
    let input = $event.target.files[0];

    let reader = new FileReader();
    reader.onload = this.parseToJson.bind(this);
    reader.readAsText(input);
  }

  parseToJson(e) {
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
      this.xmlUploadService.uploadPeriod(val);
    }); 
  }
}