![Controller](assets/title.png)

Welcome to my "Character Controller" repository! Here I am experimenting with managing entities on a canvas and some
basic terrain generation..

This repository is for educational purposes and to share and document my approach.
Feel free to explore, modify, and use any code you find here for your own learning and
projects.

The current progress is deployed as https://character-controller-henna.vercel.app/.

## What's the current state of the project?

It isn't a 'project' really - more like a playground, I'm just trying stuff out.
What is currently supported is, to control the knight character with your keyboard and to drag the minion around with
your mouse. The minion will do it's best to get back to you.
You can bully them around by swinging your sword at them, if you feel like you need some stress relief.

There is no goal or game here other than that.

## Can I peak behind the curtains?

Sure - I mean, apart from this being open source, there is a debug menu in the lower right hand corner of the screen,
which prints out some extra stuff to the canvas to help you (or mostly me) see whats going on.

## What game engine does this use?

None - or a custom-built one, depending on how you want to look at it. I thought it might be fun to start without any
libraries and just create functions when I need them.
I just draw everything onto several layers
of [HTML Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

Is that a _smart_ idea? Probably no.  
Was it _fun_? Sure!

## What optimizations are there to make it run smooth?

I am using [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) to
keep in sync with the PCs framerate and to get some extra Browser optimizations that come with animationFrames.
Right now I am not calculating [Delta Time](https://de.wikipedia.org/wiki/Delta_Time), so the whole engine will speed up
and slow down with your PCs frame rate. I might do so in the future, but this isn't supposed to have an endgoal.. It was
just fun to build.

The Pathfinding Algo is the
same [A* Implementation as in my other Repo](https://github.com/MilanFox/Pathfinder-Playground), which is as optimized
as it gets.

Also, only Layers that are expected to have dynamic data entities are included in
the [Game Loop](https://de.wikipedia.org/wiki/Game_Loop). All others are static.

## I cant use it on mobile

Yes. That's true.. I didn't build any functionality for mobiles or even any portrait mode device.

## Credits

While all the code has been hand-written by me the sprites of course weren't made by me. I am
using ["Tiny Swords" by Pixel Frog](https://pixelfrog-assets.itch.io/tiny-swords). Go check them out - they have
fantastic stuff online.
