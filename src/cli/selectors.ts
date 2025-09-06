// src/generator/selectors.ts
export const selectorMap: Record<string, string> = {
  username: '.loginuser',
  password: '.loginpass',
  loginButton: '.submit',
  loginSuccess: '#wrapper > div.divloginstatus > span:nth-child(3)',
  dozierenPlan: '#makronavigation > ul > a:nth-child(6)',
  searchProf: '#wrapper > div.divcontent > div.content > div > form > fieldset',
  startSearch: '#wrapper > div.divcontent > div.content > div > form > input[type=submit]:nth-child(14)',
  nextWeekbutton: '#wrapper > div.divcontent > div.content > table > tbody > tr > td > fieldset > form > input:nth-child(4)',
  appliedLogicPlan: '#wrapper > div.divcontent > div.content > form > table:nth-child(5) > tbody > tr:nth-child(10) > td:nth-child(2)',
  moodleLink: '#wrapper > div.divlinks > a:nth-child(8)',
  moodleLogin: '#username',
  moodlePassword: '#password',
  loginClick: '#loginbtn',
  messageButton: '[class="nav-link popover-region-toggle position-relative icon-no-margin"]',
  chatBox: 'a[data-conversation-id="421464"][data-user-id="39711"]',
  textBox: '[class="form-control bg-light"]',
  sendChat: '[class="btn btn-link btn-icon icon-size-3 ml-1 mt-auto"]'
};