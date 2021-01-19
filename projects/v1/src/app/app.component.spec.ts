import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatSnackBarModule, HttpClientModule, RouterTestingModule],
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: MatDialogRef, useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA, useValue: {}
        }
     ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
