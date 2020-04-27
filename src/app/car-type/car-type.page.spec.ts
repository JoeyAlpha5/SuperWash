import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CarTypePage } from './car-type.page';

describe('CarTypePage', () => {
  let component: CarTypePage;
  let fixture: ComponentFixture<CarTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CarTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
