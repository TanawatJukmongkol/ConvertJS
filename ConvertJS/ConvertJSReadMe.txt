What's my purpose?
 I can convert raw NBT file from https://rebane2001.com/mapartcraft/ into human
 readable instructions that is easy to read and follow. I can also convert the NBT
 mapart into a clean JSON file format for other uses too! 

How do I use it?:
 Configure some of the options inside the convert.js.
 You may also need to install Node.js




What you may need to know:

Block positions is as is in the Minecraft world.
                             __
                             /|
                            /
                           /  Y = Size[1]
          Z = size[0]     /
    <====================|
      |                  |
      |                  |
      |   O              |
      |      )           |  X = size[2]
      |   O              |
      |                  |
      |                  |
      |__________________|
                         V
                     Z
             o  o    ^
               ͜      |
                     |
                     |     ______________________________________________
        X <----------Y   <  We removed the first block of                |
                          | every column (blocks[x][0]),                 |
                          | since it's just a useless placeholder block. |

The output JSON file structure looks like this:

{
    blocks:[
        ---- z position ---->
        [{pos:[x <int>,y <int>,z <int>],state:<int>},{},{}, ... ,{}] |
        [{},{},{}, ... ,{}]                                          | X position
        [{},{},{}, ... ,{}]                                          |
        [{},{},{}, ... ,{}]                                          V
    ],
    palette:["minecraft:birch_plank","","", ... , ""],
    size:[x <int>,y <int>,z <int>]
}
