import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Acoes } from './modelos/acoes';
import { AcoesService } from './acoes.service'
import { merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

const ESPERA_DIGITACAO = 300

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {
  acoesInput = new FormControl();
  todasAcoes$ = this.acoesService.getAcoes()
    .pipe(
      tap(() => { console.log('Fluxo Inicial') })
    )
  filtroPeloInput$ = this.acoesInput.valueChanges
    .pipe(
      debounceTime(ESPERA_DIGITACAO),
      tap(() => {
        console.log('Fluxo do filtro')
      }),
      tap(console.log),
      filter((valorDigitado) => {
        return valorDigitado.length >= 3 || !valorDigitado.length
      }),
      distinctUntilChanged(),
      switchMap((valorDigitado) => {
        return this.acoesService.getAcoes(valorDigitado)
      })
    )

  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$)

  constructor(
    private acoesService: AcoesService
  ) { }
}
 