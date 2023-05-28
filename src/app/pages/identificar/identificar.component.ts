import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js'
import { ImagenesService } from 'src/app/services/imagenes.service';
import { ProcessFaceService } from 'src/app/services/process-face.service';


@Component({
  selector: 'app-identificar',
  templateUrl: './identificar.component.html',
  styleUrls: ['./identificar.component.css']
})
export class IdentificarComponent implements OnInit {

  @ViewChild('videoContainer',{static:true}) videoContainer!:ElementRef;
  @ViewChild('myCanvas',{static:true}) myCanvas!:ElementRef;


  imagenes:any[]=[];

  public context!:CanvasRenderingContext2D;

  constructor(private imagenesSvc:ImagenesService, private processSvc:ProcessFaceService) { }

  ngOnInit(): void {
    
  }


  deteccion(){
    this.main();
  }

  removeVideo(){
    location.reload();
  }

  main = async() =>{

    this.context = this.myCanvas.nativeElement.getContext('2d');

    var video = await navigator.mediaDevices.getUserMedia({video:true});


    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');


    this.imageneslista();

    let stream = this.videoContainer.nativeElement;

    stream.srcObject = video;

    const reDraw = async()=>{
      this.context.drawImage(stream,0, 0, 640, 480);
      requestAnimationFrame(reDraw);
    }

    const processFabe = async()=>{
      const detection = await faceapi.detectSingleFace(this.videoContainer.nativeElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      
      if(typeof detection == 'undefined') return;
      this.processSvc.descriptor(detection);


    }

    setInterval(processFabe,2000);
    requestAnimationFrame(reDraw);

  }

  imageneslista(){
    this.imagenesSvc.getImagenes().subscribe((res:any)=>{
      this.imagenes = res;
      this.imagenes.forEach((imagen:any)=>{
        const imageElement = document.createElement('img');
        imageElement.src = imagen.imgUrl;
        imageElement.crossOrigin = 'anonymous';

        this.processSvc.processFace(imageElement,imagen.id);
      })
    })
  }



}
