import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  RadioControlValueAccessor,
  Validators,
} from '@angular/forms';
import { ExchangeRateApiService } from './exchange-rate-api.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'technical-test-sitis';

  currentDate: Date = new Date();
  
  date!: string;
  
  currencies!: string[];
  
  symbols!: string[];
  
  result: number = 0;
  
  error = false;
  
  APIKEY: string = '';

  formData: FormGroup = this.formBuilder.group({
    date: [new Date(), Validators.required],
    userInputEuros: [' ', [Validators.required, Validators.min(0)]],
    currencies: ['--', [Validators.required]],
  });

  newApiForm: FormGroup = this.formBuilder.group({
    key: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private exchangeRateService: ExchangeRateApiService
  ) {}

  ngOnInit(): void {
    this.getSimbols();
    this.formData.controls['date'].setValue(this.currentDate);
    this.onChange();
  }

  onChange() {
    if (this.error) {
      return;
    }
    this.formData.valueChanges.subscribe((values) => {
      if (values.userInputEuros !== '0' && values.currencies !== '--') {
        console.log(values);
        this.exchangeRateService
          .getCurrency(values.date, this.symbols[values.currencies])
          .subscribe(
            (response) => {
              this.convertCurrency(Object.values(response.rates));
            },
            (err) => {
              this.error = true;
              swal.fire(
                'Ocurrio un error inesperado',
                'Probablemente sea necesaria una nueva clave para acceder a estos servicios, por favor, contacte al administrador.',
                'error'
              );
            }
          );
      }
    });
  }

  setApiKey() {
    this.exchangeRateService.API_KEY = this.newApiForm.controls['key'].value;
    this.error = false;
    this.getSimbols();
  }

  getSimbols() {
    this.exchangeRateService.getCurrenciesOptions().subscribe(
      (response) => {
        this.symbols = Object.keys(response.symbols);
        this.currencies = Object.values(response.symbols);
      },
      (err) => {
        this.error = true;
        swal.fire(
          'Ocurrio un error inesperado',
          'Probablemente sea necesaria una nueva clave para acceder a estos servicios, por favor, contacte al administrador.',
          'error'
        );
      }
    );
  }

  convertCurrency(rate: any) {
    this.result =
      parseInt(this.formData.controls['userInputEuros'].value) * parseInt(rate);
  }

  isValidInput(field: string) {
    return (
      this.formData.controls[field].errors &&
      this.formData.controls[field].touched
    );
  }
  
  isSelecttedCurrency() {
    return (
      this.formData.controls['currencies'].value === '--' &&
      this.formData.controls['currencies'].touched
    );
  }
}
