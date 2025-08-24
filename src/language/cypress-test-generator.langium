grammar CypressTestGenerator

entry Model:
  tests+=Test*;  // eine Liste von Tests

Test:
  'TEST' name=ID
  steps+=Step*;

Step:
  Navigate | Fill | Click | ExpectText;

Navigate:
  'NAVIGATE' 'TO' url=ID;

Fill:
  'FILL' selector=ID 'WITH' value=STRING;

Click:
  'CLICK' selector=ID;

ExpectText:
  'EXPECT' 'TEXT' selector=ID 'IN' text=ID;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal STRING: /"(\\.|[^"\\])*"/ | /'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;




// grammar CypressTestGenerator

// entry Model:
//   webApp = WebApp
//   "**"
//   tests+=Test;

// WebApp:
//   url=WebURL sites += WebSite
//   ;

// WebURL:
//   name = STRING
//   ;

// WebSite:
//   info = STRING;

// Test:
//   'TEST' name=ID
//   steps+=Step;

// Step:
//   Navigate | Fill | Click | ExpectText;

// Navigate:
//   'NAVIGATE' 'TO' url=[WebURL:STRING];

// Fill:
//   'FILL' selector=ID 'WITH' value=ID;

// Click:
//   'CLICK' selector=ID;

// ExpectText:
//   'EXPECT' 'TEXT' text=ID;


// hidden terminal WS: /\s+/;
// terminal ID: /[_a-zA-Z][\w_]*/;
// terminal INT returns number: /[0-9]+/;
// terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

// hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
// hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;























// // grammar CypressTestGenerator

// // entry Model:
// //     (persons+=Person | greetings+=Greeting)*;

// // Person:
// //     'person' name=ID;

// // Greeting:
// //     'Hello' person=[Person:ID] '!';

// // hidden terminal WS: /\s+/;
// // terminal ID: /[_a-zA-Z][\w_]*/;
// // terminal INT returns number: /[0-9]+/;
// // terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

// // hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
// // hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
