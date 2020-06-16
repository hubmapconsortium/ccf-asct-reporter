import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentComponent } from './indent.component';

describe('IndentComponent', () => {
  let component: IndentComponent;
  let fixture: ComponentFixture<IndentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
