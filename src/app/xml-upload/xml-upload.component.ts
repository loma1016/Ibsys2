import { Component } from '@angular/core';

@Component({
  selector: 'app-xml-upload',
  templateUrl: './xml-upload.component.html',
  styleUrls: ['./xml-upload.component.css']
})
export class XmlUploadComponent {
  
  changeListener($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any) : void {
    var file:File = inputValue.files[0]; 
    var myReader:FileReader = new FileReader();

    myReader.onloadend = function(e){
      let parseString = require('xml2js').parseString;
      
      parseString(myReader.result, function (err, result) {  
          
        console.log(result);
      });
    }
    myReader.readAsText(file);    
  }
}