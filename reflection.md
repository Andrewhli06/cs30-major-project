# CS30 Major Project Reflection:

## Questions:
- What advice would you give to yourself if you were to start a project like this again?
    Honestly, I would probably spend more time investigating the ins and outs of the game.
    In other words, if I were to start a project like this again, I would have to do much more in-depth analysis of each component to gauge its programming difficulty. Not only that, but if I decided to pursue something equally collision based, I would definitely look into p5 play as a way to simplify collision calculations. Or alternatively, I would further investigate the p5 collide2D library syntax to see its functionality with iterational code. Finally, I would tell myself to not immediately expect to achieve a 1:1 replica of the game that I am trying to emulate in the span of 6 weeks or so. That way, I still feel fulfilled and accomplished after completing the barebones of the game. 

- Did you complete everything in your “needs to have” list?
    Yes. Now, does it all function like I had envisioned it to? Not entirely, but it isn't too bad for my knowledge, as well as my lack of assistance from things such as collision libraries or p5 play. Therefore, there are quite a few bugs present. Also, does the project created feel not entirely up to CS30 Major Project standards? Not so much, but I did make use of most if not all of what was demonstrated in class.

- What was the hardest part of the project?
    Honestly, the hardest part of the project in my opinion was either determining the location of bullets, or collision within the grid's perimeter. And what I mean by that is, with my code only shooting bullets down (in terms of the y-axis), rotating the bullet had no effect on its cartesian plane coordinates. Therefore, I had to employ trigonometry to determine its actual location on the grid. Not only that, but bullet collision required additional trigonometry to determine the location of contact. And finally, internal object collision is still quite buggy due to my mathematical calculations, but overall the logic behind it had me confused for quite a bit.

- Were there any problems you could not solve?
    Not exactly, besides the wall breaking issue mentioned in the beta-testing.md file. Seeing as my cells in the grid are not objects, it is hard to assign them individual health values. I had the idea of replacing them with a cell class, but the draw loop caused what was essentially "stack overflow", pushing 100 cells at 60 fps. I actually ended up "solving" this issue, but it is far too late to convert every cell into its own object.

    Other than that, there were some issues with collision (phasing into other objects, deadzones, inaccuracies), where I believed my logic was sound, but what was produced on the screen said otherwise.

- What do you wish you had the time to investigate?
    I wish I had the time to truly understand the A* pathfinding algorithm as well as the line of sight algorithm (2D raycasting/shadowcasting). This would have largely improved the quality of my project, but would have taken a very long time.

## Overall Takeaway:
- Over the course of this project, I learned a lot about the ins and outs of game development, as well as how to teach myself to think. I found that using my IPad and drawing out a form of pseudocode was very helpful for figuring out my bugs. And I found that talking myself through problems similarly to how you would talk me through problems really helped me spark ideas on how to solve a particular issue. That being said, I still believe that I shot a little too far out of my bounds, but it forced me to dive head first into the world of game development, so in that regard I am thankful.

## "Commit History" of iterations that were not completely shown in final project commits:
- As I have mentioned, I found it easier for my brain to process the logic behind new features through coding it on a clean slate. Therefore, I found myself using the p5js web editor quite a lot, as well as VSCOde for p5 collide2D testing.

- May 9th, I used the p5js web editor to figure out the basics of character rotation (creating of the cannon on the tank), and bullet rotation respectively. I ran into an issue with the atan2 function where it was exactly 90 degrees off my cursor, but later manually fixed it by adjusting the rotation angle by 90 degrees.

- May 15th, I used the p5js web editor to figure out how to move the character around, as well as have the "gun" (where the bullets come from) follow suit. Additionally, I used the dist function to create the bulletDelete function that is found in this version.

- May 23rd, I used p5js to develop a new tank model in hopes of easing the process of collision detection. I made it so the cannon of the tank was the one rotating, and the tank itself was just a regular square that moved laterally with no rotation.

- May 31st, I created a testing vscode file for the p5 collide2d library to see if it was viable for the purposes of my project. Turns out, I was unable to get it to function properly with iterational objects (i.e. my bullets).

- June 4th, I investigated a major issue with my bullets where they would "auto track" the cursor. That is to say that the atan2 angle kept updating towards the cursor. Turns out it was a simple fix.

- June 4th, I figured out how to make an autonomous object fire bullets that went in the direction of a specific point (my cursor at the time), then, I learned how to integrate firing delay to fix the issue of turrets firing a line of bullets. (this logic was implemented not only for my turrets, but equally for the player).

- June 5th, I looked into the opacity of objects, hoping to create an FOV type of effect. The spotlight FOV turns out to be a lot harder, hence why it is not featured in the project.

- June 5th, I created a basic version of perimeter barrier detection, in hopes of getting a better understanding of how I might detect objects within the perimeter. Turns out I needed to look into the future to predict whether or not an input would land me into an impassible block.

- June 7th, I created basic trigless bullet detection, in hopes of once again getting a better understanding of how I would detect objects within the perimeter.