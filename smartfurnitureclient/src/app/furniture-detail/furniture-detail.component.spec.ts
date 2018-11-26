import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FurnitureDetailComponent } from './furniture-detail.component';

describe('FurnitureDetailComponent', () => {
  let component: FurnitureDetailComponent;
  let fixture: ComponentFixture<FurnitureDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FurnitureDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FurnitureDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
