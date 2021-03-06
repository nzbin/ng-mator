import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { SANCTUM_PREFIX, SanctumService } from './sanctum.service';
import { BASE_URL } from '../interceptors/base-url-interceptor';

describe('SanctumService', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let sanctumService;

  const setBaseUrlAndSanctumPrefix = (baseUrl: string, sanctumPrefix: string) => {
    TestBed.overrideProvider(BASE_URL, { useValue: baseUrl });
    TestBed.overrideProvider(SANCTUM_PREFIX, { useValue: sanctumPrefix });

    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    sanctumService = TestBed.inject(SanctumService);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: BASE_URL, useValue: '' },
        { provide: SANCTUM_PREFIX, useValue: '' },
        SanctumService,
      ],
    });
  });

  afterEach(() => httpMock.verify());

  it('should get csrf cookie once', done => {
    setBaseUrlAndSanctumPrefix('', '');

    sanctumService.load().then(() => done());

    httpMock.expectOne('/sanctum/csrf-cookie').flush({ cookie: true });
  });

  it('should get csrf cookie with base url', done => {
    setBaseUrlAndSanctumPrefix('http://foo.bar/api', '');

    sanctumService.load().then(() => done());

    httpMock.expectOne('http://foo.bar/sanctum/csrf-cookie').flush({ cookie: true });
  });

  it('should get csrf cookie with sanctum prefix', done => {
    setBaseUrlAndSanctumPrefix('', '/foobar/');

    sanctumService.load().then(() => done());

    httpMock.expectOne('/foobar/csrf-cookie').flush({ cookie: true });
  });

  it('should get csrf cookie with base url and sanctum prefix', done => {
    setBaseUrlAndSanctumPrefix('http://foo.bar/api/', '/foobar');

    sanctumService.load().then(() => done());

    httpMock.expectOne('http://foo.bar/foobar/csrf-cookie').flush({ cookie: true });
  });
});
