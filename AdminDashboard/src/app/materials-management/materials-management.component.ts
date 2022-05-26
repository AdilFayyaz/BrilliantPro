import { Component, OnInit } from '@angular/core';
import { MaterialsManagementService } from './materials-management.service';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { delay } from 'rxjs';


@Component({
  selector: 'app-materials-management',
  templateUrl: './materials-management.component.html',
  styleUrls: ['./materials-management.component.css']
})
export class MaterialsManagementComponent implements OnInit {
  // Existing files to display on the top
  existingFiles : MaterialData[] | undefined;

  folderName: string = "";

  folders: FolderData[] | undefined;
  getAllMaterials(){
    this.materialsManagementService.getMaterials().subscribe(mats =>{
      this.existingFiles = mats;
    });
  }
  constructor(private materialsManagementService: MaterialsManagementService) { }
  
  ngOnInit(): void {
    this.getAllMaterials();
    this.getAllFolders();
  }

  files: File[] = []

  fileSelect(event: any){
    this.files = event.target.files;
    console.log(this.files)
  }
  uploadFiles(){
    if(this.files){
      for (let i = 0; i < this.files.length; i++) {
        const firstFile = this.files[i];
        this.materialsManagementService.uploadFileToServer(firstFile).subscribe(
          (e: HttpEvent<any>) => {
            if (e.type === HttpEventType.UploadProgress) {
              console.log('Upload Progress: ');
              
            } else if (e.type === HttpEventType.Response) {
              console.log(e);
            }
            this.getAllMaterials();
            var formM = <HTMLFormElement>document.getElementById('materialForm');
            formM?.reset();
          },
          (error) => {
            console.log(error);
          }
        )
      }
    }
  }
  createFolder(){
    this.materialsManagementService.createFolder(this.folderName);
    this.folderName = "";
    this.getAllFolders();
  }
  getAllFolders(){
    this.materialsManagementService.getFolders().subscribe(folders =>{
      this.folders = folders;
    });
  }
  getFilesCount(files: number[] | undefined){
    if(files){
      return files.length;
    }
    else{
      return 1;
    }
  }

  getFileNameOnId(id: number){
    if(this.existingFiles){
      var x = this.existingFiles.find(x => x._id == id);
      if(x){
        return x.name;
      }
      return "";
    }
    return "";
  }

  // delete a folder
  deleteFolder(id: number | undefined){
    this.materialsManagementService.deleteFolder(id);
    this.getAllFolders();
  }

  // delete a file
  deleteFile(id: number | undefined){
    this.materialsManagementService.deleteMaterial(id);
    this.getAllFolders();
    this.getAllMaterials();
  }

  // add material to folder
  idsList: number[] =[];
  addMaterialToFolder(folderId: number | undefined){  
    setTimeout (() =>{ 
      if (this.files){
        console.log(this.files)
        // get list of object Ids of files
        this.materialsManagementService.getListOfFileIds(this.files).subscribe(
          values => {
            console.log(values.body)
            // var j = JSON.parse(values.body)
            for(var x=0; x< values.body.length; x++){
              this.idsList.push(values.body[x]._id)
            }
            console.log(this.idsList)
            if(this.idsList){
              for(var i=0;i<this.idsList.length;i++){
                console.log("Adding to server folder")
                this.materialsManagementService.uploadFileToServerOnFolder(this.idsList[i], folderId)
              }
            }
          }
        )
        this.files = [];
      }
      console.log ("First")}
      , 500)
    
   
      
      // for(var i=0;i<x.length;i++){

      // }
      // add files to folder
      // if(x!=null){
        // for(var i = 0; i < x.length; i++){
      // this.materialsManagementService.uploadFileToServerOnFolder(x, folderId);
        // }
      // }
    
  }
}

class MaterialData{
  _id: number | undefined;
  name: string | undefined;
  type: string | undefined;
  isDownloadable: string | undefined;
}


class FolderData{
  _id: number | undefined;
  name: string | undefined;
  parent: string | undefined;
  files: number[] | undefined;
}