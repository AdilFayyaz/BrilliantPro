export interface MaterialInterface{
  "_id": string,
  "name": string,
  "type": string,
  "isDownloadable": boolean,
  "path":string
}

export interface FolderInterface{
  "materials":MaterialInterface[]
}

