- textures
- matrix / vector classes
- frame buffer
- vao?
- cameras
- render list (get single mesh or children from scene)
- renderer options (alpha, etc)
- dirty / needsUpdate flag for attributes, program, geometry
- figure out lib/module import/package field
- use typescript?
- destroy
- ...

Readme:
- add motivations / standalone-shader
- add notice that it requires ES6 private fields support

### Motivations & Goals
- Go further than [my standalone shader lib](https://github.com/ayamflow/standalone-shader/)
- Solidify knowledge of matrices, cameras
- Avoid singleton & static classes
- abstract away the `gl` variable
- POJO for attributes and uniforms
- 