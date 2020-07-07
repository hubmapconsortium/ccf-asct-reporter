import { TestBed, async } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatTooltipModule],
            declarations: [
                NavbarComponent
            ],
        }).compileComponents();
    }));

    it('should create the component', () => {
        const fixture = TestBed.createComponent(NavbarComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should render logo1', () => {
        const fixture = TestBed.createComponent(NavbarComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('img.logo1').src).toContain('assets/logo.svg');
    })

    it('should render logo2', () => {
        const fixture = TestBed.createComponent(NavbarComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('img.logo2').src).toContain('assets/ccf.svg');
    })

});
