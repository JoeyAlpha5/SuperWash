import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaygatePage } from './paygate.page';

describe('PaygatePage', () => {
  let component: PaygatePage;
  let fixture: ComponentFixture<PaygatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaygatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaygatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
