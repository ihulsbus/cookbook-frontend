import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { CookbookComponent } from './cookbook.component';

describe('CookbookComponent', () => {
  let component: CookbookComponent;
  let fixture: ComponentFixture<CookbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CookbookComponent ],
      providers: [provideHttpClient(), provideHttpClientTesting(), importProvidersFrom(AuthModule.forRoot({ config: { authority: 'http://localhost/test-issuer', clientId: 'test-client', redirectUrl: 'http://localhost/test-redirect' } })), MessageService, { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) }, paramMap: of(convertToParamMap({})), params: of({}) } }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
