import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  market?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styleUrls: ['./marcadores.component.css']
})
export class MarcadoresComponent implements AfterViewInit{

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-3.8923897360758235, 40.52279208151563];
  centerMarcador: any;

  // Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerLocalStorage();

    // Agregar cualquier elemento como marcador
    /* const marketHtml: HTMLElement = document.createElement('div');
    marketHtml.innerHTML = 'Hola Mundo';
    new mapboxgl.Marker({
      element: marketHtml
    })
      .setLngLat(this.center)
      .addTo(this.mapa); */

    /* const maker = new mapboxgl.Marker()
      .setLngLat(this.center)
      .addTo(this.mapa); */
  }

  agregarMarcador() {

    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat(this.center)
      .addTo(this.mapa);

    /* this.marcadores.push(nuevoMarcador); */
    this.marcadores.push({
      color,
      market: nuevoMarcador
    });

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });
  }

  irMarcador(marker: mapboxgl.Marker) {

    /* console.log(marker); */

    this.mapa.flyTo({
      center: marker.getLngLat()
    })
  }

  guardarMarcadoresLocalStorage() {

    const lngLatArr: any[] = []

    this.marcadores.forEach( m => {
      const color = m.color;
      const {lng, lat} = m.market!.getLngLat();

      lngLatArr.push({
        color: color,
        centro: [lng,lat]
      })
    })

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerLocalStorage() {

    if(!localStorage.getItem('marcadores')){
      return
    }

    const lngLatArr: any[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach(m => {
      const newMarket = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
        .setLngLat(m.centro)
        .addTo(this.mapa);

      this.marcadores.push({
        market: newMarket,
        color: m.color
      });

      newMarket.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });

    })
  }

  borrarMarcador(i: number) {
    this.marcadores[i].market?.remove();
    this.marcadores.splice(i,1);
    this.guardarMarcadoresLocalStorage();
  }

}
