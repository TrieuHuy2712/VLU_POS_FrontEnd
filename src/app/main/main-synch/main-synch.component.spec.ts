import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSynchComponent } from './main-synch.component';

describe('MainSynchComponent', () => {
  let component: MainSynchComponent;
  let fixture: ComponentFixture<MainSynchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainSynchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSynchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
