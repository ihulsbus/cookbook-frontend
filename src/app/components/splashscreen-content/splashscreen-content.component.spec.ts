import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { SplashscreenContentComponent } from './splashscreen-content.component';

describe('SplashscreenContentComponent', () => {
  let component: SplashscreenContentComponent;
  let fixture: ComponentFixture<SplashscreenContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SplashscreenContentComponent ],
      providers: [provideHttpClient(), provideHttpClientTesting(), importProvidersFrom(AuthModule.forRoot({ config: { authority: 'http://localhost/test-issuer', clientId: 'test-client', redirectUrl: 'http://localhost/test-redirect' } })), MessageService, { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) }, paramMap: of(convertToParamMap({})), params: of({}) } }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplashscreenContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
