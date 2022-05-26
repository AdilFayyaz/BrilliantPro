import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { json } from 'body-parser';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialsManagementService {
  tempArr: string[] = [];
  getListOfFileIds(files: File[]): Observable<any>{
    this.tempArr = [];
    let fileNames = [];
    for (let i = 0; i < files.length; i++) {
      fileNames.push(files[i].name);
    }
    console.log(fileNames)
    var fNames = JSON.stringify(fileNames);
    var i=0;
    const request = new HttpRequest('POST', 'http://localhost:3000/getListOfMaterials?fileNames=' + fileNames, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpclient.request(request)
      // let p = fetch("http://localhost:3000/getListOfMaterials?fileNames="+fileNames, {
      //   method: 'POST',
      //   }).then(
      //     response => response.text()
      //   )
      //   .then(result => {
      //     console.log(result)
      //     var j = JSON.parse(result)
      //     if(result){
      //       for(var x=0; x< j.length; x++){
      //         this.tempArr.push(j[x]._id)
      //       }
      //       console.log(this.tempArr)
      //     }
      //     return this.tempArr;
      //   })
  }

  constructor(private httpclient: HttpClient) { }
  uploadFileToServer(file:File):Observable<HttpEvent<any>>{
    const f = new FormData();
    f.append("Materials", file);
    const request = new HttpRequest('POST', 'http://localhost:3000/uploadMaterialContent', f, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpclient.request(request)
  }
  getMaterials():Observable<any>{
    return this.httpclient.get('http://localhost:3000/getAllMaterials');
  }

  createFolder(folderName:string):any{
    // let req = 'http://localhost:3000/createFolder?' + 
    // "name="+ folderName + "&parent=root";
    // console.log(req)
    // return this.httpclient.post(req, null);

    var requestOptions = {
      method: 'POST',
    };
    
    fetch("http://localhost:3000/createFolder?name="+folderName+"&parent=root", requestOptions)
      .then(response => response.text())
      .then(result => {return result});

    }

  getFolders():Observable<any>{
    return this.httpclient.get('http://localhost:3000/getAllFolders');
  }

  // delete a folder
  deleteFolder(folderId:number | undefined):any{
    var requestOptions = {
      method: 'POST',
    };

    if(folderId){
        fetch("http://localhost:3000/deleteFolder?folderId="+folderId, requestOptions)
          .then(response => response.text())
          .then(result => {return result});
      }
    }

  // delete a material
  deleteMaterial(materialId:number | undefined):any{
    var requestOptions = {
      method: 'DELETE',
    };

    if(materialId){
        fetch("http://localhost:3000/deleteMaterial?materialId="+materialId, requestOptions)
          .then(response => response.text())
          .then(result => {return result});
      }
    }

  uploadFileToServerOnFolder(fileId: number | undefined, folderId:number | undefined):any{
    fetch("http://localhost:3000/uploadFileToServerOnFolder?fileId="+fileId+"&folderId="+folderId, {
      method: 'POST',
    })
    .then(response =>response.text())
    .then(result => {return result})
  }
}
function then(arg0: () => string[]) {
  throw new Error('Function not implemented.');
}

