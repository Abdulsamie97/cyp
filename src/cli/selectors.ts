// src/generator/selectors.ts
export const selectorMap: Record<string, string> = {
  username: '.loginuser',
  password: '.loginpass',
  loginButton: '.submit',
  loginSuccess: '[class="divloginstatus"]',
  lecturerPlan: '#makronavigation > ul > a:nth-child(6)',
  searchProf: '#wrapper > div.divcontent > div.content > div > form > fieldset',
  startSearch: '#wrapper > div.divcontent > div.content > div > form > input[type=submit]:nth-child(14)',
  nextWeekbutton: 'input.kleinerButton[type="submit"][name="week_after"]',
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