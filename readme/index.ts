import { readFileSync, writeFileSync } from 'fs';

const examplePath = 'sierpinski_ah';

writeFileSync('./README.md', readFileSync('./readme/README.md', 'utf8').replace('{{example}}', `${'```'}
${readFileSync(`./test/programs/${examplePath}.l`, 'utf8')}
${'```'}
<img src="https://raw.githubusercontent.com/bks1b/l-ang/main/test/res/${examplePath}.png">`));