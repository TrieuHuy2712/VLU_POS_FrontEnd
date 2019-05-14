import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDataSynchComponent } from './detail-data-synch.component';

describe('DetailDataSynchComponent', () => {
  let component: DetailDataSynchComponent;
  let fixture: ComponentFixture<DetailDataSynchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailDataSynchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDataSynchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
