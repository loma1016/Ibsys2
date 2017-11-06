import { PlanningtoolPage } from './app.po';

describe('planningtool App', () => {
  let page: PlanningtoolPage;

  beforeEach(() => {
    page = new PlanningtoolPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
