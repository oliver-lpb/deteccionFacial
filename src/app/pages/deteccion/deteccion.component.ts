import { Component, OnInit } from '@angular/core';
import { ImagenesService } from 'src/app/services/imagenes.service';

@Component({
  selector: 'app-deteccion',
  templateUrl: './deteccion.component.html',
  styleUrls: ['./deteccion.component.css']
})
export class DeteccionComponent implements OnInit {

  idImagen:any;
  imagenData:any;
  imgNombre:any;
  imgFoto:any;

  constructor(private imagensSvc:ImagenesService) { }

  ngOnInit(): void {
  this.obtenerImg();
  }

  obtenerImg(){
    this.idImagen = localStorage.getItem('id');
    this.imagensSvc.getImagen(this.idImagen).subscribe(res=>{
      this.imagenData = res;
      this.imgNombre = this.imagenData.nombreImagen;
      this.imgFoto = this.imagenData.imgUrl;
    });
  }

  volver(){
    localStorage.removeItem('id');
    location.href = '/identificar';
  }


}
