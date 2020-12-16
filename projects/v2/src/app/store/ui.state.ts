import { SheetService } from '../services/sheet.service';
import {State, Action, StateContext, Selector, Select} from '@ngxs/store';
import { Sheet, Data } from "../models/sheet.model";
import { Error, Response } from "../models/response.model";

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Spec, View } from 'vega'
import { Injectable } from '@angular/core';
import { updateVegaSpec, updateVegaView, updateBimodal } from '../actions/tree.actions';
import { fetchSheetData } from '../actions/sheet.actions';
import { TNode } from '../models/tree.model';

export class UIStateModel {

}


@State<UIStateModel>({
  name: 'uiState',
  defaults: {
  }
})
@Injectable()
export class UIState {
  
  constructor() {
  }

}