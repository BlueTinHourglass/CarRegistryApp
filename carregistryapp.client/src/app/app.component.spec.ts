import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent, Car } from './app.component';


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve cars from the server', () => {
    const mockCars: Car[] = [
      { expiryDate: '2025-01-01', make: 'Toyota', registration: 'TOY1001', expiryStatus: 'Active' },
      { expiryDate: '2024-12-31', make: 'Honda', registration: 'HON1002', expiryStatus: 'Expired' },
    ];


    component.ngOnInit();

    const req = httpMock.expectOne('/car');
    expect(req.request.method).toEqual('GET');
    req.flush(mockCars);

    expect(component.cars).toEqual(mockCars);
  });
});
