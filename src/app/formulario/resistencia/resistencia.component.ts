import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-resistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './resistencia.component.html',
  styleUrls: ['./resistencia.component.css']
})
export default class ResistenciaComponent implements OnInit {

  formulario!: FormGroup;
  resultados: any[] = [];
  tablaVisible: boolean = false; // Variable para controlar la visibilidad de la tabla
  
  colores: { [key: number]: string } = {
    0: 'Negro',
    1: 'Café',
    2: 'Rojo',
    3: 'Naranja',
    4: 'Amarillo',
    5: 'Verde',
    6: 'Azul',
    7: 'Violeta',
    8: 'Gris',
    9: 'Blanco'
  };
  
  colores2: { [key: number]: string } = {
    1: 'Negro',
    10: 'Café',
    100: 'Rojo',
    1000: 'Naranja',
    10000: 'Amarillo',
    100000: 'Verde',
    1000000: 'Azul',
    10000000: 'Violeta',
    100000000: 'Gris',
    1000000000: 'Blanco'
  };

  constructor() {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      color1: new FormControl('', Validators.required),
      color2: new FormControl('', Validators.required),
      color3: new FormControl('', Validators.required),
      tolerancia: new FormControl('', Validators.required)
    });

    // Cargar datos del localStorage al iniciar
    this.cargarDesdeLocalStorage();
  }

  cargarDesdeLocalStorage() {
    const datosGuardados = JSON.parse(localStorage.getItem('datosResistencia') || '[]');
    this.resultados = datosGuardados.map((data: any) => {
      return {
        colo1: this.colores[data.color1],
        colo2: this.colores[data.color2],
        colo3: this.colores2[data.color3],
        tolerancia: data.tolerancia,
        valor: data.valor,
        valormax: data.valormax,
        valormin: data.valormin
      };
    });
  }

  calcular() {
    const col1 = Number(this.formulario.get('color1')?.value); // Convertimos a número
    const col2 = Number(this.formulario.get('color2')?.value); // Convertimos a número
    const col3 = Number(this.formulario.get('color3')?.value); // Convertimos a número
    const tol = Number(this.formulario.get('tolerancia')?.value); // Convertimos a número
    
    const valor = ((col1 * 10) + col2) * col3;
    const tolerancia = tol;
    const valormax = valor + (valor * tolerancia);
    const valormin = valor - (valor * tolerancia);
    
    const resultado = {
      colo1: this.colores[col1],
      colo2: this.colores[col2],
      colo3: this.colores2[col3],
      tolerancia,
      valor,
      valormax,
      valormin
    };

    this.resultados.push(resultado);
    this.guardarEnLocalStorage({ color1: col1, color2: col2, color3: col3, tolerancia: tol, valor, valormax, valormin });
    this.tablaVisible = true; // Mostrar la tabla al calcular
  }

  mostrarTabla() {
    this.tablaVisible = true; // Cambia la visibilidad de la tabla al presionar el botón "Mostrar"
  }

  guardarEnLocalStorage(formData: any) {
    let datosGuardados = JSON.parse(localStorage.getItem('datosResistencia') || '[]');
    datosGuardados.push(formData);
    localStorage.setItem('datosResistencia', JSON.stringify(datosGuardados));
  }

  vaciarLocalStorage() {
    localStorage.removeItem('datosResistencia');
    this.resultados = [];
    this.tablaVisible = false; // Ocultar la tabla al eliminar
  }

  colorToClass(colorName: string) {
    const colorClasses: { [key: string]: string } = {
      'Negro': 'bg-black text-white',
      'Café': 'bg-brown-600 text-white',
      'Rojo': 'bg-red-600 text-white',
      'Naranja': 'bg-orange-600 text-white',
      'Amarillo': 'bg-yellow-500 text-white',
      'Verde': 'bg-green-600 text-white',
      'Azul': 'bg-blue-600 text-white',
      'Violeta': 'bg-purple-600 text-white',
      'Gris': 'bg-gray-400 text-black',
      'Blanco': 'bg-white text-black'
    };

    return colorClasses[colorName] || '';
  }
}
