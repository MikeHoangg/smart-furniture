import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowDisallowComponent } from './allow-disallow.component';

describe('AllowDisallowComponent', () => {
  let component: AllowDisallowComponent;
  let fixture: ComponentFixture<AllowDisallowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowDisallowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowDisallowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
