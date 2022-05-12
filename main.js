const fs = require("fs");

function compile(bf)
{
  var labels = new Array();
  return bf.split('').map(function(c){
    switch(c)
    {
      case '>':
        return "INC BL";
      case '<':
        return "DEC BL";
      case '+':
        return "INC [BL]";
      case '-':
        return "DEC [BL]";
      case '.':
        return "MOV AH, 0x13\nMOV AL, [BL]\nINT 0x10";
      case ',':
        return "XOR AH, AH\nINT 0X13\n MOV [BL], AL
      case '[':
        var test = new String();
        do{
          test = Math.random().toString(36).slice(2).replace(/[0-9]/g, '');
        }while(labels.includes(test));
        labels.push(test);
        return test.concat(":");
      case ']':
        return "MOV AL, [BL]\nOR AL, AL\nJNZ ".concat(labels[labels.length-1]); //Need to fix that but idk how rn
    };
  }).filter(function(x){return x;}).join('\n');
};

function main(argc, argv)
{
  if(argc !== 3)
  {
    process.stderr.write("Usage:\r\n\tbf2os <file.bf> <file.asm>\r\n");
    process.exit(1);
  };
  
  fs.readFile(argv[2], "UTF-8", function(err, data){
    if(err)
      throw err;
    
    const result = compile(data);
    fs.writeFile(argv[3], result, "UTF-8", function(err){
      if(err)
        throw err;
      
      console.log("Done !");
      process.exit(0);
    });
  });
};

main(process.argv.length, process.argv);
