const { compile } = require('@mdx-js/mdx');
async function test() {
  const source = `
<QuizMultipleChoice 
  question="test" 
  options={[
    "A",
    "B"
  ]} 
  correctIndex={0} 
/>`;
  const compiled = await compile(source, { jsx: true });
  console.log(String(compiled));
}
test();
