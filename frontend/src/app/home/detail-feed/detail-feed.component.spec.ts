import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFeedComponent } from './detail-feed.component';

describe('DetailFeedComponent', () => {
  let component: DetailFeedComponent;
  let fixture: ComponentFixture<DetailFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailFeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
