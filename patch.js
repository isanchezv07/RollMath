const fs = require('fs');
let code = fs.readFileSync('src/lib/MatterEngine.ts', 'utf8');
code = code.replace(
  'MatterBody.applyForce(ball.body, ball.body.position, {',
  'console.log("Pushing ball!", dirX * strength, dirY * strength);\n              MatterBody.applyForce(ball.body, ball.body.position, {'
);
fs.writeFileSync('src/lib/MatterEngine.ts', code);
