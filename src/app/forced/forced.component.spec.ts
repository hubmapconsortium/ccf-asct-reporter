import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcedComponent } from './forced.component';

describe('ForcedComponent', () => {
  let component: ForcedComponent;
  let fixture: ComponentFixture<ForcedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForcedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
