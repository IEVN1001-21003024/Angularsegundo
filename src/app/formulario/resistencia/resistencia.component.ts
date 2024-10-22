import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ColorEntry {
  color1: string;
  color2: string;
  color3: string;
  tolerancia: string;
  valorMinimo: number | null;
  valorMaximo: number | null;
}

@Component({
  selector: 'app-resistencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resistencia.component.html',
  styleUrls: ['./resistencia.component.css']
})
export default class ResistenciaComponent {
  formGroup: FormGroup;
  colores: ColorEntry[] = [];
  valorMinimo: number | null = null;
  valorMaximo: number | null = null;
  mostrarTabla: boolean = false;

  readonly valoresColores: { [key: string]: number } = {
    Negro: 0,
    Café: 1,
    Rojo: 2,
    Naranja: 3,
    Amarillo: 4,
    Verde: 5,
    Azul: 6,
    Violeta: 7,
    Gris: 8,
    Blanco: 9,
    'Oro 5%': 5,
    'Plata 10%': 10
  };

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      color1: ['', Validators.required],
      color2: ['', Validators.required],
      color3: ['', Validators.required]
    });

    this.loadColores();
  }

  loadColores() {
    const storedColores = localStorage.getItem('colores');
    if (storedColores) {
      try {
        this.colores = JSON.parse(storedColores) as ColorEntry[];
        if (!Array.isArray(this.colores)) {
          this.colores = [];
        }
      } catch (error) {
        console.error('Error al parsear los colores desde el almacenamiento local:', error);
        this.colores = [];
      }
    }
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const tolerancia = localStorage.getItem('tolerancia');
      const coloresSeleccionados: ColorEntry = {
        ...this.formGroup.value,
        tolerancia: tolerancia || null,
        valorMinimo: null,
        valorMaximo: null
      };

      this.colores.push(coloresSeleccionados);
      localStorage.setItem('colores', JSON.stringify(this.colores));

      this.calcularResistencia(coloresSeleccionados);
      this.mostrarTabla = true;

      console.log('Colores guardados:', this.colores);
      this.formGroup.reset();
    }
  }

  onToleranciaChange(tolerancia: string) {
    if (['Oro 5%', 'Plata 10%'].includes(tolerancia)) {
      localStorage.setItem('tolerancia', tolerancia);
    }
  }

  getColor(color: string) {
    const colorMap: { [key: string]: string } = {
      'Oro 5%': '#FFD700',
      'Plata 10%': '#C0C0C0',
      Rojo: '#FF0000',
      Amarillo: '#FFFF00',
      Verde: '#00FF00',
      Café: '#8B4513',
      Naranja: '#FFA500',
      Violeta: '#800080',
      Negro: '#000000',
      Azul: '#0000FF',
      Gris: '#808080',
      Blanco: '#FFFFFF'
    };
    return colorMap[color] || '';
  }

  calcularResistencia(coloresSeleccionados: ColorEntry) {
    const tolerancia = coloresSeleccionados.tolerancia;

    if (this.colores.length > 0) {
      const { color1, color2, color3 } = coloresSeleccionados;

      const valorColor1 = this.valoresColores[color1];
      const valorColor2 = this.valoresColores[color2];
      const multiplicador = Math.pow(10, this.valoresColores[color3]);

      if (valorColor1 !== undefined && valorColor2 !== undefined && multiplicador) {
        const resistenciaTotal = (valorColor1 * 10 + valorColor2) * multiplicador;

        if (tolerancia === 'Oro 5%') {
          this.valorMinimo = resistenciaTotal * 0.95;
          this.valorMaximo = resistenciaTotal * 1.05;
        } else if (tolerancia === 'Plata 10%') {
          this.valorMinimo = resistenciaTotal * 0.90;
          this.valorMaximo = resistenciaTotal * 1.10;
        }

        this.colores[this.colores.length - 1].valorMinimo = this.valorMinimo;
        this.colores[this.colores.length - 1].valorMaximo = this.valorMaximo;

        localStorage.setItem('colores', JSON.stringify(this.colores));

        console.log('Resistencia Total:', resistenciaTotal);
        console.log('Valor Mínimo:', this.valorMinimo);
        console.log('Valor Máximo:', this.valorMaximo);
      }
    }
  }

  mostrarTablaDesdeLocalStorage() {
    this.loadColores();
    this.mostrarTabla = true;
  }

  eliminarRegistros() {
    this.colores = [];
    localStorage.removeItem('colores');
    this.mostrarTabla = false;
    console.log('Todos los registros han sido eliminados.');
  }
}
