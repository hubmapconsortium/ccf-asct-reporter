import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisComponent } from './vis.component';

describe('VisComponent', () => {
  let component: VisComponent;
  let fixture: ComponentFixture<VisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
