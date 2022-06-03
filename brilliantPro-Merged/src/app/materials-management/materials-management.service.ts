import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { json } from 'body-parser';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialsManagementService {
  tempArr: string[] = [];


  constructor(private httpclient: HttpClient) { }

  getMaterials():Observable<any>{
    return this.httpclient.get('http://localhost:3000/getAllMaterials');
  }

  createFolder(folderName:string):Observable<any>{
    console.log(folderName)
    return this.httpclient.post('http://localhost:3000/createFolder?folderName='+folderName, {})
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
  deleteMaterial(materialId:number | undefined, folderId: number | undefined):Observable<any>{
    return this.httpclient.post("http://localhost:3000/deleteFileFromFolder?materialId="+materialId+"&folderId="+folderId, {})
  }


    // updated correct - add material to folder
  uploadFile(files :File[], folderId: number): Observable<any>{
    let f = new FormData();
    for(let fx of files){
      f.append("Materials", fx);
    }
    return this.httpclient.post('http://localhost:3000/uploadMaterialContent?folderId='+folderId, f)
  }

  // edit a folder
  editFolder(folderId: number | undefined, folderName: string):Observable<any>{
    return this.httpclient.post('http://localhost:3000/editFolder?folderId='+folderId+"&folderName="+folderName, {})
  }

  //edit a material
  editMaterial(material: any, materialId: number | undefined, folderId: number | undefined, materialToEdit: any):Observable<any>{
    var obj = {
      _id: "",
      name: "",
      path: Boolean,
      type: "",
      isDownloadable: ""
    }
  if(material.name){obj.name=material.name}
  else{obj.name=materialToEdit.name}
  if(material.type){obj.type=material.type}
  else{obj.type=materialToEdit.type}
  if(material.isDownloadable!=null){obj.isDownloadable=material.isDownloadable}
  else{obj.isDownloadable=materialToEdit.isDownloadable}

  obj.path = materialToEdit.path;
  obj._id = materialToEdit._id;

    return this.httpclient.post('http://localhost:3000/editMaterial?materialId='+materialId+"&folderId="+folderId, obj)
  }


}


