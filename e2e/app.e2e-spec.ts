import { NgAutoCompletePage } from './app.po';

describe('ng-auto-complete App', () => {
  let page: NgAutoCompletePage;

  beforeEach(() => {
    page = new NgAutoCompletePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
