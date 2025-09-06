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