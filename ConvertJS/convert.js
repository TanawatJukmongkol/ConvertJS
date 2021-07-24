// Inputs
const Raw_NBT = "./rawExample.nbt", // NBT File Path
      JSON_File = ""; // JSON File Path

// Outputs
const SaveAs = "instructions"; // Name to save as your output.
const OutputAsJSON = false; // Read NBT and convert it to JSON onto a file


// How to use: 1. Configure some of the option above.
//             2. Open CMD or terminal and type "node convert.js"
//             3. Press [Enter] to run
//             4. Get your instructions, and start building!

// Dependencies: node.js

// Notes: 1) You'll need the NBT file from https://rebane2001.com/mapartcraft/
//        2) Build from Bottom east (bottom right corner, bottom to top).
//        3) In the first chunk in every row, If there's only one block type, then the
//           whole row is the same blocktype.

/////////////////////////////////////////////////////////////

const program_config = {
    version: "v1.6.0 stable",
    debug: {
        blockState: false
    },
    license: "MIT",
    creator: "Tanawat J.",
    GitHub: ""
};



/////////////////////////////////////////////////////////////

console.log("Convert.js "+program_config.version);

const fs = require('fs'),
      nbt = require('./nbt.js');

if (Raw_NBT) {
    console.log("Reading NBT file...");
    nbt.parse(fs.readFileSync(Raw_NBT), function(error, data) {
        // {block:{value:{value:[{},{},{},...,{#N}]}}} // data
        if (error) { throw error; }
        // 
        let _data = {
            blocks:[/*
                [{pos:[0,0,0],state:22},{},{},...,{}], // Ignored
                [{},{},{},...,{}],
                [{},{},{},...,{}],
                    ...
                [{},{},{},...,{}],
            */],
            palette: data.value.palette.value.value, // ["minecraft:birch_plank",...]
            size: data.value.size.value.value,
        };
        console.log("Clean up data...");
        // Clean up data value mess.
        while(data.value.blocks.value.value.length > 0){
            let blockSet = data.value.blocks.value.value.slice(0, _data.size[2]);
            for (var i = 0; i < blockSet.length; i++) {
                let pos = blockSet[i].pos.value.value;
                let state = blockSet[i].state.value;
                blockSet[i].pos = pos;
                blockSet[i].state = state;
            }
            _data.blocks.push(blockSet);
            
            data.value.blocks.value.value.splice(0, _data.size[2]);
        }
        for (let i = 0; i < _data.palette.length; i++) {
            let name = _data.palette[i].Name.value;
            _data.palette[i] = name;
        }

        if (OutputAsJSON) {
            console.log("Writing to disk...");
            fs.writeFile(SaveAs+".json",JSON.stringify(_data),function(e){   // Write as JSON
                if (e) { throw e; }
            });
            console.log("Converted to JSON successfully!");
            return;
        }
        convert(_data);
    });
} else if (JSON_File) {
    console.log("Reading JSON file...");
    let path = JSON_File.split("/");
    let name = path[path.length];
    convert(JSON.parse(fs.readFileSync(name)));
} else {
    console.error("No input file given");
}

function convert (data) {

    console.log("Converting to human readable instructions...");

    let instr = "Convert.js "+program_config.version+"\nGet your own map art at https://rebane2001.com/mapartcraft/";
    let reports = "";
    let count = 0;

    for (let x = 0; x < data.size[0]; x++) {
        let ppos = data.blocks[x][0].pos[1]; // Previous position of the block in 3D ([x,y,z]).
        let ppalette = data.palette[data.blocks[x][0].state]; // Previous palette
        let pdirr = 1; // Repeated block dirrection, and repeated block count.
        let rblockCount = 1; // Repeated block count.
        let rowChunk = 1; // Row chunk counter
        
        instr += "\n////////// line "+(x+1)+" //////////\n";
        for (let z = 1; z < data.size[2]; z++) {
            let pos = data.blocks[x][z].pos[1]; // Position of the block in 3D ([x,y,z])
            let dirr = pos - ppos; // Block placement Dirrection
            let pal = data.palette[data.blocks[x][z].state];
            
            if(count % 16 === 0){
                instr += "\n-- chunk "+rowChunk+" --\n";
                rowChunk++;
            }
            
            if(dirr > 1 || dirr < -1){reports += "Defect at [row "+(x+1)+", col "+(z)+"]. (Dirrection is "+(dirr >= 0 ? "+"+dirr:dirr)+")\n";} // Map defect detection

            if ( (rblockCount !== 1 && (ppalette !== pal || pdirr !== dirr) ) || count % 16 === 0 ) { // If block is crossed-chunk, or block is not the same and isn't the first block
            
                instr += "[row "+(x+1)+", col "+(z)+"] "                             //  "[row 0, col 0] "
                        
                        + pal.replace("minecraft:", (program_config.debug.blockState? data.blocks[x][z].state+": " : ""))
                                                                                     //  "22: birch_plank"
                        
                        + " " + ( pdirr > 0   ? "UP"      // if                      //  " UP"
                                : pdirr === 0 ? "FLAT"    // else if
                                :              "DOWN" )  // else
                        
                        + (rblockCount>1?" x"+rblockCount: "") + "\n";                                 //  " x6\n"
                                                                                     //  "[row 0, col 0] 22: birch_plank UP x6
                ppalette = pal;
                rblockCount = 1;

            } else { // If blocks are the same, and it's inside the chunk
                rblockCount++;
            }
            
            ppos = pos;
            pdirr = dirr;
            count++;
            
        }
    }

    if(reports){ console.error(reports); }

    // Save file

    console.log("Writing to disk...");
    fs.writeFile(SaveAs+".txt", instr+"\n"+reports, function(e){
        if(e){
            throw e;
        }
    });
    console.log("Done!");
}
