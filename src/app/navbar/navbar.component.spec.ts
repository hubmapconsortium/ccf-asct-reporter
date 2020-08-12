import { TestBed, async } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { SconfigService } from '../services/sconfig.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NavbarComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatTooltipModule, HttpClientTestingModule, MatMenuModule],
            declarations: [
                NavbarComponent
            ],
        }).compileComponents();
    }));

    it('should create the navbarr component', () => {
        const fixture = TestBed.createComponent(NavbarComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should render logo1', () => {
        const fixture = TestBed.createComponent(NavbarComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('img.logo1').src).toContain('assets/logo.svg');
    });

    it('should render logo2', () => {
        const fixture = TestBed.createComponent(NavbarComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('img.logo2').src).toContain('assets/ccf.svg');
    });

    // it('should validate dropdown valuee', async () => {
    //     const fixture = TestBed.createComponent(NavbarComponent);
    //     const trigger = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;
    //     trigger.click();
    //     fixture.detectChanges();
    //     await fixture.whenStable().then(() => {
    //         const inquiryOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
    //         expect(inquiryOptions.length).toBeGreaterThan(0);
    //     });
    // });
});
