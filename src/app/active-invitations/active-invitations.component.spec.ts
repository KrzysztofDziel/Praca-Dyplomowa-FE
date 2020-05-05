import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveInvitationsComponent } from './active-invitations.component';

describe('ActiveInvitationsComponent', () => {
  let component: ActiveInvitationsComponent;
  let fixture: ComponentFixture<ActiveInvitationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveInvitationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveInvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
