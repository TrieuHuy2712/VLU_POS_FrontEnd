import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSynchComponent } from './data-synch.component';

describe('DataSynchComponent', () => {
  let component: DataSynchComponent;
  let fixture: ComponentFixture<DataSynchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSynchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSynchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
