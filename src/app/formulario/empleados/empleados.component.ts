import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

interface Empleado {
  matricula: string;
  nombre: string;
  correo: string;
  edad: number;
  horas: number;
}

@Component({
  selector: 'empleados',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './empleados.component.html',
  styles: []
})
export default class EmpleadosComponent implements OnInit {
  formulario!: FormGroup;
  listaEmpleados: Empleado[] = [];
  modoEdicion: boolean = false;
  matriculaActual: string | null = null;

  constructor(private readonly formBuilder: FormBuilder) {}

  private crearFormulario(): FormGroup {
    return this.formBuilder.group({
      matricula: ['', Validators.required],
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      edad: [0, [Validators.required, Validators.min(18)]],
      horas: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.formulario = this.crearFormulario();
    this.cargarEmpleados();
  }

  agregarOActualizarEmpleado() {
    const nuevoEmpleado: Empleado = {
      matricula: this.formulario.get('matricula')?.value,
      nombre: this.formulario.get('nombre')?.value,
      correo: this.formulario.get('correo')?.value,
      edad: this.formulario.get('edad')?.value,
      horas: this.formulario.get('horas')?.value
    };

    if (this.modoEdicion && this.matriculaActual) {
      const index = this.listaEmpleados.findIndex(emp => emp.matricula === this.matriculaActual);
      if (index !== -1) {
        this.listaEmpleados[index] = nuevoEmpleado;
        this.modoEdicion = false;
        this.matriculaActual = null;
      }
    } else {
      this.listaEmpleados.push(nuevoEmpleado);
    }

    this.guardarEnLocalStorage();
    this.formulario.reset();
    this.cargarEmpleados();
  }

  cargarEmpleadoParaEditar() {
    const matricula = this.formulario.get('matricula')?.value;
    const empleado = this.listaEmpleados.find(emp => emp.matricula === matricula);

    if (empleado) {
      this.formulario.patchValue({
        matricula: empleado.matricula,
        nombre: empleado.nombre,
        correo: empleado.correo,
        edad: empleado.edad,
        horas: empleado.horas
      });
      this.modoEdicion = true;
      this.matriculaActual = matricula;
    } else {
      alert('Empleado no encontrado.');
    }
  }

  eliminarEmpleado() {
    const matricula = this.formulario.get('matricula')?.value;
    this.listaEmpleados = this.listaEmpleados.filter(emp => emp.matricula !== matricula);
    this.guardarEnLocalStorage();
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      this.listaEmpleados = JSON.parse(empleadosGuardados);
    }
  }

  guardarEnLocalStorage() {
    localStorage.setItem('empleados', JSON.stringify(this.listaEmpleados));
  }

  // Nuevas funciones para calcular el pago de horas normales, adicionales y el subtotal
  calcularPagoHorasNormales(horas: number): number {
    const horasNormales = horas > 40 ? 40 : horas;
    return horasNormales * 70; // Pago por hora normal es 70
  }

  calcularPagoHorasAdicionales(horas: number): number {
    const horasExtras = horas > 40 ? horas - 40 : 0;
    return horasExtras * 140; // Pago por hora extra es 140
  }

  calcularSubtotal(horas: number): number {
    return this.calcularPagoHorasNormales(horas) + this.calcularPagoHorasAdicionales(horas);
  }

  calcularTotalPagos(): number {
    return this.listaEmpleados.reduce((total, empleado) => total + this.calcularSubtotal(empleado.horas), 0);
  }
}