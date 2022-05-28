import { Component, OnInit } from '@angular/core';
import { MaterialsManagementService } from './materials-management.service';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { delay } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-materials-management',
  templateUrl: './materials-management.component.html',
  styleUrls: ['./materials-management.component.css']
})
export class MaterialsManagementComponent implements OnInit {
  // Existing files to display on the top
  existingFiles : MaterialData[] | undefined;

  folderName: string = "";
  folderId: number | undefined;
  materialId: number | undefined;
  materialToEdit: any;
  folders: FolderData[] | undefined;

  editMaterialForm = new FormGroup({
    name: new FormControl(''),
    type: new FormControl(''),
    isDownloadable2: new FormControl(''),
    isDownloadable: new FormControl(Boolean)
  })


  getAllMaterials(){
    this.materialsManagementService.getMaterials().subscribe(mats =>{
      this.existingFiles = mats;
    });
  }
  constructor(private materialsManagementService: MaterialsManagementService) { }
  
  ngOnInit(): void {
    // this.getAllMaterials();
    this.getAllFolders();
  }

  files: File[] = []

  fileSelect(event: any){
    this.files = event.target.files;
  }
  createFolder(){
    this.materialsManagementService.createFolder(this.folderName).subscribe(
      (data) => {
        console.log(data);
        this.getAllFolders();
      }
    )
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
  deleteFile(materialid: number | undefined, folderid: number | undefined){
    this.materialsManagementService.deleteMaterial(materialid, folderid).subscribe(
      (data) => {
        console.log(data);
        this.getAllFolders();
      }
    )
    this.getAllFolders();
  }

 // add material to a folder
  addMaterialToFolder(){  
    if(this.folderId){
      console.log(this.files)
      this.materialsManagementService.uploadFile(this.files, this.folderId).subscribe(
        (e: HttpEvent<any>) => {
          if (e.type === HttpEventType.UploadProgress) {
            console.log('Upload Progress: ');
            this.getAllFolders();
            
          } else if (e.type === HttpEventType.Response) {
            console.log(e);
          }
          this.getAllFolders();
          var formM = <HTMLFormElement>document.getElementById('materialForm');
          formM?.reset();
        }
      )
      this.getAllFolders();
    }
 
  }

  // edit Current Folder
  editCurrentFolder(folderId: number | undefined){
    this.folderId = folderId;
  }
  // edit Folder
  editFolder(){
    this.materialsManagementService.editFolder(this.folderId, this.folderName).subscribe(
      (data) => {
        console.log(data);
        this.getAllFolders();
      }
    );
    this.getAllFolders();
  }

  // edit Current Material
  editCurrentMaterial(materialId: number | undefined, folderId: number | undefined, material: any){
    this.materialToEdit = material;
    this.folderId = folderId;
    this.materialId = materialId;
  }

  // edit Material
  editMaterial(){
    if(this.editMaterialForm.value.isDownloadable2 == "true"){
      this.editMaterialForm.value.isDownloadable = true;
    }
    if(this.editMaterialForm.value.isDownloadable2 == "false"){
      this.editMaterialForm.value.isDownloadable = false;
    }
    console.log(this.editMaterialForm.value)
    this.materialsManagementService.editMaterial(this.editMaterialForm.value,this.materialId, this.folderId, this.materialToEdit).subscribe(
      (data) => {
        console.log(data);
        this.getAllFolders();
      }
    );
    this.getAllFolders();
    this.editMaterialForm.reset();
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
  materials: MaterialData[] | undefined;
}