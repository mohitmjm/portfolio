const fs = require('fs');
const data = JSON.parse(fs.readFileSync('E:/portfolio-main/src/data/smartHR.json'));
const result = [];
for(let i=0; i<data.length; i+=2) {
    const item = {
        title: data[i].title,
        description: data[i+1].title, // the description got read as title because it wasn't a bullet
        features: data[i+1].features,
        technology: data[i+1].technology,
        image: `/assets/smart-hr/tab_${(i/2)+1}.png`
    };
    result.push(item);
}
fs.writeFileSync('E:/portfolio-main/src/data/smartHR.js', 'export const smartHRData = ' + JSON.stringify(result, null, 2) + ';');
console.log('Successfully generated smartHR.js with ' + result.length + ' items.');
