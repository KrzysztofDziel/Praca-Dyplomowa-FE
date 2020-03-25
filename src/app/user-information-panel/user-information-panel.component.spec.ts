import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInformationPanelComponent } from './user-information-panel.component';

describe('UserInformationPanelComponent', () => {
  let component: UserInformationPanelComponent;
  let fixture: ComponentFixture<UserInformationPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInformationPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInformationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
