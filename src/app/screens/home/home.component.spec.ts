import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HomeComponent ],
      providers: [provideHttpClient(), provideHttpClientTesting(), importProvidersFrom(AuthModule.forRoot({ config: { authority: 'http://localhost/test-issuer', clientId: 'test-client', redirectUrl: 'http://localhost/test-redirect' } })), MessageService, { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) }, paramMap: of(convertToParamMap({})), params: of({}) } }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
