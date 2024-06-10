// pageObjects/HeaderPage.js
class HeaderPage {
    constructor(page) {
      this.page = page;
      this.moreMenuIcon = '#header-more-menu-icon';
      this.profileInfo = '[data-e2e="profile-info"]';
    }
  
    async clickMoreMenuIcon() {
      await this.page.click(this.moreMenuIcon);
    }
  
    async clickProfileInfo() {
      await this.page.waitForSelector(this.profileInfo);
      await this.page.click(this.profileInfo);
    }
  }
  
  module.exports = HeaderPage;